"use client";

import SimpleNavbar from "@/components/SimpleNavbar";
import { Footer } from "@/components/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SimpleNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
