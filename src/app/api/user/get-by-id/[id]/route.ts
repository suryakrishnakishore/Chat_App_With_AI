import connectDB from "@/lib/database";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string }}) {
    await connectDB();

    const id = params.id;

    let user = await User.findById(id);

    if(!user) {
        return NextResponse.json({error: "User not found."}, {status: 404});
    }

    return NextResponse.json({user}, { status: 404 });
}