import connectDB from "@/lib/database";
import { saveProfileImage } from "@/lib/saveProfileImage";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default async function POST(req: Request) {
    await connectDB();

    const formData = await req.formData();
    const email = formData.get("email") as string;
    const sessionToken = formData.get("sessionToken") as string;
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const gender = formData.get("gender") as string;
    const age = formData.get("age") as string;
    const profileImage = formData.get("profileImage") as File | null;

    let user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ error: `User with email ${email} not found.` }, { status: 404 });
    }

    if (name && name !== user.name) user.name = name;
    if (username && username !== user.username) user.username = username;
    if (gender && gender !== user.gender) user.gender = gender;
    if (age && age !== user.age) user.age = age;

    let imageUrl = null;
    if (profileImage) {
        imageUrl = await saveProfileImage(profileImage);
    }

    await User.updateOne(
        { email },
        { name, username, gender, age, profileImage: imageUrl }
    );

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