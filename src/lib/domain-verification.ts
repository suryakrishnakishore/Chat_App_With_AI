import dns from "dns/promises";

type DomainVerifyResult =
    | { exists: true, method: "mx" | "a", records: any[] }
    | { exists: false, method: "none", records: any[], error?: string };

export default async function domainVerify(domain: string, opts: { timeoutMs?: number } = {}): Promise<DomainVerifyResult> {
    const timeoutMs = opts.timeoutMs ?? 3000;

    if (!domain || typeof domain !== "string") {
        return { exists: false, method: "none", records: [], error: "invalid-domain" };
    }
    domain = domain.trim().toLowerCase();

    const callWithTimeout = <T>(promise: Promise<T>, ms: number) =>
        Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

    try {
        const mxRecords = (await callWithTimeout<any[]>(dns.resolveMx(domain), timeoutMs).catch(() => [])) as any[];
        if (mxRecords && mxRecords.length > 0) {
            mxRecords.sort((a, b) => a.priority - b.priority);
            const exchanges = mxRecords.map(r => ({ exchange: r.exchange, priority: r.priority }));
            return { exists: true, method: "mx", records: exchanges };
        }
    } catch (mxErr) {

    }

    try {
        const aRecords = (await callWithTimeout<string[]>(dns.resolve(domain, "A"), timeoutMs).catch(() => [])) as string[];
        const aaaaRecords = (await callWithTimeout<string[]>(dns.resolve(domain, "AAAA"), timeoutMs).catch(() => [])) as string[];

        const addresses: string[] = [...(aRecords ?? []), ...(aaaaRecords ?? [])];

        if (addresses.length > 0) {
            return { exists: true, method: "a", records: addresses };
        }

        return { exists: false, method: "none", records: [] };
    } catch (err: any) {
        return { exists: false, method: "none", records: [], error: err.message || String(err) };
    }
}

