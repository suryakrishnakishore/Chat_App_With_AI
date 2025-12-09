"use client";
import { useState } from "react";
import api, { setAuthToken } from "@/lib/apiCalls";

export default function SetupProfile({ email, sessionToken, onDone }: { email: string, sessionToken: string, onDone: () => void }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("sessionToken", sessionToken);
      formData.append("name", name);
      formData.append("username", username);
      formData.append("gender", gender);
      formData.append("age", age);
      if (profileImage) formData.append("profileImage", profileImage);

      const res = await api.post("/auth/setup-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAuthToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      onDone();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save profile");
    }

    setLoading(false);
  };

  return (
    <div className="w-[450px] bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-lg animate-fadeIn">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Setup your profile 👤
      </h2>

      {/* Profile image input */}
      <label className="block text-gray-700 font-medium mb-2">Profile Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
        className="w-full border border-gray-300 rounded-lg p-3 mb-4 cursor-pointer focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Full name"
        className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Username"
        className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Gender */}
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select gender
        </option>
        <option value="male">Male ♂</option>
        <option value="female">Female ♀</option>
        <option value="other">Other ⚧</option>
      </select>

      {/* Age */}
      <input
        type="number"
        placeholder="Age"
        className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <button
        onClick={handleSave}
        disabled={!name || !username || !gender || !age || loading}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg transition font-medium"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
