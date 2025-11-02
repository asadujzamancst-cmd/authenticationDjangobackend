import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AuthApp",
  description: "Django + Next.js Authentication System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <Navbar />
        <main className="pt-8">{children}</main>
      </body>
    </html>
  );
}
