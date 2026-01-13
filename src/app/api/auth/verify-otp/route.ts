import connectDB from "@/lib/database";
import { redis } from "@/lib/redis";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {

        await connectDB();



        const { email, otp } = await req.json();
        console.log("verify otp req: ", email, " ", otp);
        if (!email || !otp) return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });

        const storedOTP = await redis.get(`otp:${email}`);

        if (!storedOTP) {
            return NextResponse.json({ error: "OTP expired or not found" }, { status: 400 });
        }
        console.log("Stored OTP: ", storedOTP);
        
        if (storedOTP.toString().trim() !== otp.toString().trim()) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

        await redis.del(`otp:${email}`);

        let user = await User.findOne({ email });
        if (!user) {
            const defaultName = email.split("@")[0] || "User";
            user = await User.create({
                email,
                name: defaultName,
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return NextResponse.json({ error: "JWT secret not configured" }, { status: 500 });
        }

        const token = jwt.sign(
            { id: user._id.toString(), email: user.email },
            secret,
            { expiresIn: "7d" }
        );

        return NextResponse.json({ user, token }, { status: 200 });
    } catch (error: any) {
        console.error("Error in OTP verification: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}