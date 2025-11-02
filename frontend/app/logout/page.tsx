"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // ✅ 1. Remove access & refresh tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // ✅ 2. Redirect to login page
    router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-lg text-gray-700">
      Logging out...
    </div>
  );
}
