import { writeFile } from "fs/promises";
import path from "path";

export async function saveProfileImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const timestamp = Date.now();
  const safeFileName = file.name.replace(/\s+/g, "_");
  const fileName = `${timestamp}-${safeFileName}`;

  const uploadDir = path.join(process.cwd(), "uploads/profileImage");
  const fullPath = path.join(uploadDir, fileName);

  // write buffer to disk
  await writeFile(fullPath, buffer);

  // return the public URL path
  return `/uploads/profileImage/${fileName}`;
}
