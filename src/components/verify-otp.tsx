import React, { useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import api from '@/lib/apiCalls';
import OtpInput from './otp-input';

function VerifyOTP({ email, onBack, onSuccess }: { email: string, onBack: () => void, onSuccess: (tempToken: string) => void }) {

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerifyOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            console.log("Verifying OTP for email: ", email, " otp: ", otp);
            
            const response = await api.post("/api/auth/verify-otp", {
                email, otp
            });
            
            console.log("OTP verification response: ", response);
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

            <OtpInput value={otp} onChange={setOtp} />

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