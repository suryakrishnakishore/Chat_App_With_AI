import connectDB from "@/lib/database.js";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { username: string } }) {
    try {
        await connectDB();

        const username = params.username;

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const users = await User.find({ regex: { username: new RegExp(`^${username}`, "i")}});

        if (users.length === 0) {
            return NextResponse.json({
                error: "No users found.",
            }, { status: 404 });
        }

        return NextResponse.json({ searchedUsers: users }, { status: 200 });
    } catch (err: any) {
        console.log("Error while getting the required users.");
        return NextResponse.json({
            error: "Internal Server Error",
            status: 500
        });
    }
}