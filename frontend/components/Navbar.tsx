"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    setLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    router.push("/logout");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white shadow">
      <Link href="/" className="text-xl font-semibold">
        🔒 AuthApp
      </Link>
      <div className="flex gap-5 text-sm md:text-base">
        <Link href="/">Home</Link>
        {!loggedIn && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
        {loggedIn && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
