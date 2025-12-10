import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir, unlink } from "fs/promises";
import dbConnect from "@/lib/database";
import User from "@/models/User";

export async function PUT(req: Request) {
  try {
    await dbConnect();

    const form = await req.formData();

    const userId = form.get("userId") as string;
    const username = form.get("username") as string;
    const about = form.get("about") as string;
    const gender = form.get("gender") as string;
    const age = form.get("age") as string;
    const newImage = form.get("profileImage") as File | null;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let newImagePath: string | null = null;

    // DELETE OLD IMAGE
    if (newImage) {
      if (existingUser.profileImage) {
        const oldImagePath = path.join(process.cwd(), existingUser.profileImage);

        try {
          await unlink(oldImagePath);
        } catch (err) {
          console.warn("Old image delete failed:", err);
        }
      }

      // SAVE NEW IMAGE
      const uploadDir = path.join(process.cwd(), "uploads", "profileImage");
      await mkdir(uploadDir, { recursive: true });

      const bytes = await newImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${newImage.name}`;
      const fullPath = path.join(uploadDir, fileName);

      await writeFile(fullPath, buffer);

      newImagePath = `/uploads/profileImage/${fileName}`;
    }

    // UPDATE USER
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        about,
        gender,
        age,
        ...(newImagePath && { profileImage: newImagePath }),
      },
      { new: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
