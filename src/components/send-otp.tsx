import React, { useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import api from '@/lib/apiCalls';

function SendOTP({ onSuccess }: { onSuccess: (email: string) => void }) {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(!email) return;

        try {
            setLoading(true);
            const response = await api.post("/api/auth/send-otp", {
                email
            });

            console.log("OTP sent response: ", response.data);

            if (response.data.status === 200) {
                onSuccess(email);
            }

        } catch (error: any) {
            console.error("Error sending OTP: ", error.response?.data || error.message);

        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="w-[430px] bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-lg animate-fadeIn">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                Welcome 👋
            </h2>
            <p className="text-gray-600 mb-6 text-center">
                Enter your email to continue
            </p>

            <input
                type="email"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-amber-900 transition"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button
                onClick={handleSendOTP}
                disabled={!email || loading}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg transition font-medium"
            >
                {loading ? "Sending..." : "Send OTP"}
            </button>
        </div>
    )
}

export default SendOTP