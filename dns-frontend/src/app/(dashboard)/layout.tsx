"use client";

import React from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Collapsible Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Simplified Navbar */}
        <DashboardHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 custom-scrollbar">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
