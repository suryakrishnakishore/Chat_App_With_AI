"use client";
import { useState } from "react";
import SendOTP from "../send-otp";
import VerifyOTP from "../verify-otp";
import SetupProfile from "../setup-profile";

export default function Auth() {
  const [step, setStep] = useState<"send" | "verify" | "setup">("send");
  const [email, setEmail] = useState("");
  const [sessionToken, setSessionToken] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {step === "send" && (
        <SendOTP
          onSuccess={(mail) => {
            setEmail(mail);
            setStep("verify");
          }}
        />
      )}

      {step === "verify" && (
        <VerifyOTP
          email={email}
          onBack={() => setStep("send")}
          onSuccess={(tempToken) => {
            setSessionToken(tempToken);
            setStep("setup");
          }}
        />
      )}

      {step === "setup" && (
        <SetupProfile
          email={email}
          sessionToken={sessionToken}
          onDone={() => {
            window.location.href = "/";
          }}
        />
      )}
    </div>
  );
}
