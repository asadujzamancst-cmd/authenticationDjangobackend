"use client";
import { useEffect, useState } from "react";
import { apiRequest, BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${BASE_URL}/dashboard/`, {
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access")}`,
          },
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No user found
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>
        <div className="space-y-3 text-gray-800">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Full Name:</strong> {user.full_name || "N/A"}
          </p>
          <p>
            <strong>Authorized:</strong>{" "}
            {user.is_authorized ? "✅ Yes" : "❌ No"}
          </p>
        </div>
        <button
          onClick={() => router.push("/logout")}
          className="mt-6 bg-red-500 text-white w-full p-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <Link href="/Attendance" className="mt-4 text-blue-500 hover:underline">
        Go to Attendance Page
      </Link>
    </div>
  );
}
