"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api"; // Make sure you have this helper

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState<string>("");
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(""); // clear previous message

    try {
      const data = await apiRequest("login/", "POST", form);
      // Save tokens in localStorage
      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);

      setMsg("✅ Login successful!");
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err: any) {
      setMsg("❌ " + (err.message || "Login failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow rounded w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

        <input
          className="border p-2 w-full mb-3 rounded"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 w-full mb-3 rounded"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p className="text-right mt-2 text-sm">
          <a
            href="/password-reset"
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </a>
        </p>

        {msg && (
          <p className="mt-4 text-sm text-center text-gray-600 break-words">
            {msg}
          </p>
        )}
      </form>
    </div>
  );
}
