"use client";

import React from "react";
import { ConnectButton } from "thirdweb/react";
import client from "@/app/client";
import { ModeToggle } from "@/components/ModeToggle";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6 gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Quick search records..." 
              className="pl-10 h-10 w-full bg-secondary/50 border-border/50 rounded-xl focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* Action Container */}
        <div className="flex items-center gap-3 ml-auto">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl relative group hover:bg-primary/10">
            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background animate-pulse" />
          </Button>
          
          <ModeToggle />
          
          <div className="h-8 w-px bg-border/50 mx-1 hidden sm:block" />
          
          <ConnectButton
            client={client}
            theme="dark"
            connectButton={{
              className: "dashboard-wallet-button h-10 px-4 rounded-xl font-medium !bg-primary !text-primary-foreground hover:!bg-primary/90 transition-all",
              label: "Connect Wallet"
            }}
          />
        </div>
      </div>
    </header>
  );
}
