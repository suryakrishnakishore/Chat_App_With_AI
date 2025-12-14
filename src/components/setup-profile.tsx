"use client";
import { useEffect, useState } from "react";
import api, { setAuthToken } from "@/lib/apiCalls";
import useStore from "@/store";

export default function SetupProfile({
  email,
  sessionToken,
  onDone,
}: {
  email: string;
  sessionToken: string;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { setCredentials } = useStore((state) => state);

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

      const res = await api.post("/api/auth/setup-profile", formData);

      if (res.status !== 200) throw new Error("Failed to save profile");

      const user = { ...res.data.user, token: res.data.token };

      setCredentials(user);
      setAuthToken(res.data.token);
      onDone();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save profile");
    }

    setLoading(false);
  };

  const getExsistingUser = async () => {
    try {
      const res = await api.get(`/api/user/get-profile/${email}`);

      if(res.status !== 200) throw new Error("Failed to fetch profile.");

      setName(res.data.uesr.name || "");
      setUsername(res.data.user.username || "");
      setGender(res.data.user.gender);
      setAge(res.data.user.age?.toString() || "");
    } catch (error: any) {
      console.error("Error fetching existing user: ", error);
      
    }
  }

  useEffect(() => {
    getExsistingUser();
  }, []);

  return (
    <div className="w-[450px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
      
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
        Setup your profile 👤
      </h2>

      {/* Profile Image Label */}
      <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
        Profile Image
      </label>

      {/* Profile Image Input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
        className="w-full border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 mb-5 cursor-pointer focus:ring-2 focus:ring-blue-500"
      />

      {/* Name */}
      <input
        type="text"
        placeholder="Full name"
        className="w-full border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 mb-5 focus:ring-2 focus:ring-blue-500 outline-none"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Username */}
      <input
        type="text"
        placeholder="Username"
        className="w-full border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 mb-5 focus:ring-2 focus:ring-blue-500 outline-none"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Gender */}
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 mb-5 focus:ring-2 focus:ring-blue-500 outline-none"
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
        className="w-full border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      {/* Submit Button */}
      <button
        onClick={handleSave}
        disabled={!name || !username || !gender || !age || loading}
        className="
          w-full py-3 rounded-lg font-semibold transition 
          bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 
          text-white shadow-md
        "
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
