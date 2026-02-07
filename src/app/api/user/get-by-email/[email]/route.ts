import connectDB from "@/lib/database";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { email: string } }) {
    try {
        await connectDB();

        const email = await params.email;
        // console.log("Params: ", params);
        
        // console.log("email: ", email);
        

        if (!email) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (user.length === 0) {
            return NextResponse.json({
                error: "No users found.",
            }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (err: any) {
        console.log("Error while getting the required users.", err);
        return NextResponse.json({
            error: "Internal Server Error",
            status: 500
        })
    }
}