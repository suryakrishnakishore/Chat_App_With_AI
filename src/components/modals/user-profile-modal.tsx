"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import useStore from "@/store";
import api from "@/lib/apiCalls";

export default function UserProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { user, setCredentials } = useStore((state) => state);

  const [username, setUsername] = useState(user?.username || "");
  const [about, setAbout] = useState(user?.about || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [age, setAge] = useState(user?.age || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("userId", user._id);
    formData.append("username", username);
    formData.append("about", about);
    formData.append("gender", gender);
    formData.append("age", age);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const res = await api.put("/api/user/update-profile", formData);

    if (res.status === 200) {
      setCredentials(res.data.user);
      onClose();
    } else {
      alert(res.data.error);
    }
  };

  // Close modal when clicked outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex justify-center items-center p-4">
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-8 relative animate-fadeIn max-h-[90vh] overflow-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-semibold text-neutral-800 dark:text-neutral-100 text-center mb-8">
          My Profile
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src={user?.profileImage || "/placeholder.png"}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full object-cover shadow-md border border-neutral-300 dark:border-neutral-700"
          />

          <label className="mt-3 text-blue-600 dark:text-blue-400 text-sm cursor-pointer hover:underline">
            Change Photo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={user?.name || ""}
            disabled
            className="w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg px-4 py-2 border border-neutral-300 dark:border-neutral-700 cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg px-4 py-2 border border-neutral-300 dark:border-neutral-700 cursor-not-allowed"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
            Username
          </label>
          <input
            type="text"
            className="w-full bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg px-4 py-2 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* About */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
            About
          </label>
          <textarea
            className="w-full h-24 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg px-4 py-2 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>

        {/* Gender + Age */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
              Gender
            </label>
            <select
              className="w-full bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg px-4 py-2 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male ♂</option>
              <option value="female">Female ♀</option>
              <option value="other">Other ⚧</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
              Age
            </label>
            <input
              type="number"
              className="w-full bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg px-4 py-2 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-8 transition font-semibold shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
