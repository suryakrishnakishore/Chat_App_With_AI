import connectDB from "@/lib/database";
import { saveProfileImage } from "@/lib/saveProfileImage";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectDB();

  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const sessionToken = formData.get("sessionToken") as string;

    const name = formData.get("name") as string | null;
    const username = formData.get("username") as string | null;
    const gender = formData.get("gender") as string | null;
    const age = formData.get("age") as string | null;

    const profileImage = formData.get("profileImage") as File | null;

    let user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: `User with email ${email} not found.` },
        { status: 404 }
      );
    }

    if (name && name.trim() && name !== user.name) user.name = name.trim();
    if (username && username.trim() && username !== user.username)
      user.username = username.trim();
    if (gender && gender.trim() && gender !== user.gender) user.gender = gender;
    if (age && age.trim() && age !== user.age?.toString())
      user.age = Number(age);

    if (profileImage && profileImage.size > 0) {
      const imageUrl = await saveProfileImage(profileImage);
      if (imageUrl) user.profileImage = imageUrl;
    }

    await user.save();

    // Re-generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "JWT secret not configured" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      secret,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ user, token }, { status: 200 });
  } catch (error) {
    console.error("ERROR updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
