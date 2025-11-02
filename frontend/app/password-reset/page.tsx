"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");

    try {
      await apiRequest("password-reset/", "POST", { email });
      setMsg("✅ OTP sent to your email!");
    } catch (err: any) {
      setMsg("❌ " + (err.message || "Failed to send OTP"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow rounded w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Password Reset
        </h1>

        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
        >
          Send OTP
        </button>

        {msg && <p className="mt-4 text-sm text-center text-gray-600">{msg}</p>}
      </form>
    </div>
  );
}
