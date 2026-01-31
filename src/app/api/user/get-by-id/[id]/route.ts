import connectDB from "@/lib/database";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const id = params.id;
        // console.log("Id of other user: ", id);
        
        let user = await User.findById(id);
        // console.log("Other user: ", user);
        
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (err: any) {
        console.log("Error while fetching the user by id: ", err);
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }
}