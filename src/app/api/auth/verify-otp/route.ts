import connectDB from "@/lib/database";
import { redis } from "@/lib/redis";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    await connectDB();

    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });

    const storedOTP = await redis.get(`otp:${email}`);

    if (storedOTP !== otp) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    await redis.del(`otp:${email}`);

    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            email,
            name: "",
        });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return NextResponse.json({ error: "JWT secret not configured" }, { status: 500 });
    }

    const token = jwt.sign(
        { id: user._id.toString(), email: user.email },
        secret,
        { expiresIn: "1d" }
    );

    return NextResponse.json({ user, token }, { status: 200 });
}