import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Super App - Quản lý Tài chính Cá nhân",
  description: "Ứng dụng quản lý tài chính cá nhân toàn diện với đầu tư, thẻ tín dụng thông minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
