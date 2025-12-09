import React, { useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import api from '@/lib/apiCalls';

function VerifyOTP({ email, onBack, onSuccess }: { email: string, onBack: () => void, onSuccess: (tempToken: string) => void }) {

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerifyOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const otpInput = (e.target as HTMLButtonElement).form?.otp as HTMLInputElement;
        const otp = otpInput.value;

        try {
            setLoading(true);
            const response = await api.post("/api/auth/verify-otp", {
                email, otp
            });
            
            // console.log("OTP verification response: ", response.data);
            if(response.status === 200) {
                onSuccess(response.data.token);
            }

        } catch (error: any) {
            console.error("Error sending OTP: ", error.response?.data || error.message);
            alert(error.response?.data?.error || "Invalid OTP");

        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="w-[430px] bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-lg animate-fadeIn">
            <button onClick={onBack} className="text-sm text-blue-600 mb-3 hover:underline">
                ← Change email
            </button>

            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                Enter OTP 🔐
            </h2>

            <input
                type="text"
                maxLength={6}
                className="w-full tracking-widest text-center text-xl border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />

            <button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || loading}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg transition font-medium"
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
        </div>
    )
}

export default VerifyOTP;