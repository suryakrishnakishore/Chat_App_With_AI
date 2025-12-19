import JWT from "jsonwebtoken";
import { NextRequest } from "next/server";

export function getAuthUser(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    return JWT.verify(token, process.env.JWT_SECRET!);
}
