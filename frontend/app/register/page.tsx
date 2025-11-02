"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    full_name: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");

    try {
      await apiRequest("register/", "POST", form);
      setMsg("✅ Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err: any) {
      setMsg("❌ " + (err.message || "Registration failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow rounded w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 transition"
        >
          Register
        </button>

        {msg && <p className="mt-4 text-sm text-center text-gray-600">{msg}</p>}
      </form>
    </div>
  );
}
