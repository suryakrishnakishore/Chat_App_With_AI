"use client";
import { useRef } from "react";

type Props = {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
};

export default function OtpInput({ length = 6, value, onChange }: Props) {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (digit: string, index: number) => {
    if (!/^\d?$/.test(digit)) return;
    const otpArray = value.split("");

    otpArray[index] = digit;
    const newOtp = otpArray.join("");
    onChange(newOtp);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={value[index] || ""}
          ref={(el) => (inputsRef.current[index] = el as HTMLInputElement)}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="
            w-12 h-14 text-center text-2xl font-semibold 
            border-2 border-gray-300 rounded-lg 
            focus:border-blue-600 focus:outline-none
            bg-gray-50 shadow-sm
            text-amber-900
          "
        />
      ))}
    </div>
  );
}
