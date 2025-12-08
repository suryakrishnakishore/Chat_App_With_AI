import domainVerify from "@/lib/domain-verification.js";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

    const emailRegex = /^.+@.+\..+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const { exists } = await domainVerify(email.split("@")[1]);
    if (!exists) {
        return NextResponse.json({ error: "Email domain does not exist" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(`otp:${email}`, otp, {
        ex: 300,
    });

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        from: process.env.EMAIl_USER,
        to: email,
        subject: "Your OTP Code",
        test: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    });

    return NextResponse.json({
        message: "OTP send successfully."
    }, { status: 200 });
}

