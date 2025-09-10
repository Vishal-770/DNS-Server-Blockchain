import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DNS DAO - Decentralized DNS Management",
  description:
    "Manage your domains on the blockchain with complete ownership and control. Secure, transparent, and truly owned by you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdwebProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavBar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
