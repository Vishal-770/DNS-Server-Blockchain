import React from "react";
import Link from "next/link";
import { ConnectButton, darkTheme, lightTheme } from "thirdweb/react";
import client from "@/app/client";
import { ModeToggle } from "@/components/ModeToggle";
import { Blocks } from "lucide-react";
import { useTheme } from "next-themes";

export default function SimpleNavbar() {
  const { theme } = useTheme();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
          <Blocks className="h-6 w-6" />
          <span>Dancing DNS</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <Link 
            href="/domains" 
            className="hidden sm:block text-sm font-semibold tracking-wide text-muted-foreground hover:text-primary transition-all hover:translate-x-0.5"
          >
            Launch App
          </Link>
          
          <ModeToggle />
          
          <ConnectButton
            client={client}
            theme={theme === "light" ? lightTheme() : darkTheme()}
            connectButton={{
                className: "landing-wallet-button !h-9 !px-4 !rounded-lg !text-sm !font-semibold !bg-primary !text-primary-foreground hover:!bg-primary/90 transition-all shadow-sm",
                label: "Sign In"
            }}
          />
        </div>
      </div>
    </nav>
  );
}
