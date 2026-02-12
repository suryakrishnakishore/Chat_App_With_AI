import Message from "@/models/Message";
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  await connectDB();

  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId } = params;

  const unreadCount = await Message.countDocuments({
    chatId,
    senderId: { $ne: user.id },
    status: { $ne: "seen" },
  });

  return NextResponse.json({ unreadCount });
}
