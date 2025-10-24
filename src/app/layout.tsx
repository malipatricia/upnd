// app/layout.tsx (Server Component)
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ClientProviders from "./clientProvider"; // ✅ client wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UPND Membership System",
  description: "UPND Membership Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <div className="min-h-screen bg-gray-50">{children}</div>
          <Toaster position="top-right" richColors duration={4000} />
        </ClientProviders>
      </body>
    </html>
  );
}
