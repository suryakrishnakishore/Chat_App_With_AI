import connectDB from "@/lib/database";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { email: string[] }}) {
    connectDB();

    let user = await User.findOne({ email: params.email });

    if(!user) {
        return NextResponse.json({
            error: "User not found"

        }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
}