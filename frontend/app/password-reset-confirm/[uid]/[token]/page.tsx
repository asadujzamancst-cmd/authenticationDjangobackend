"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiRequest } from "../../../../lib/api";

export default function PasswordResetConfirmPage() {
  const router = useRouter();
  const params = useParams(); // { email, otp }
  const { email, otp } = params as { email: string; otp: string };

  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");

    try {
      await apiRequest("password-reset-confirm/", "POST", {
        email,
        otp,
        new_password: newPassword,
      });
      setMsg("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setMsg("❌ " + (err.message || "Password reset failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow rounded w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 transition"
        >
          Reset Password
        </button>

        {msg && <p className="mt-4 text-sm text-center text-gray-600">{msg}</p>}
      </form>
    </div>
  );
}
