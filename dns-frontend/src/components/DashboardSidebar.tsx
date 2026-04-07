"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronLeft, 
  LayoutDashboard, 
  Globe, 
  Terminal, 
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import client from "@/app/client";
import { contractAddress } from "@/constants/contract";

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { id: "overview", name: "Overview", href: "/domains", icon: LayoutDashboard },
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const account = useActiveAccount();

  const contract = getContract({
    address: contractAddress as string,
    chain: sepolia,
    client,
  });

  const { data, isPending } = useReadContract({
    contract,
    method: "function getDomainsByUser(address user) view returns (string[] domainNames, address[] domainContracts)",
    params: [account?.address as string],
  });

  const domainNames = data?.[0] || [];
  const domainContracts = data?.[1] || [];

  const NavLink = ({ item, isSubItem = false }: { item: NavItem; isSubItem?: boolean }) => {
    const isActive = pathname === item.href;
    return (
      <Link href={item.href} className="block group">
        <div
          className={cn(
            "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out border border-transparent",
            isActive 
              ? "bg-primary/20 text-primary border-primary/20 shadow-sm" 
              : "text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/10",
            isCollapsed && "justify-center px-0",
            isSubItem && !isCollapsed && "ml-4 py-1.5 text-xs"
          )}
        >
          {isActive && (
            <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
          )}
          
          <item.icon className={cn(
            "shrink-0 transition-transform duration-200 group-hover:scale-110",
            isSubItem ? "h-3.5 w-3.5" : "h-5 w-5",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          )} />
          
          {!isCollapsed && (
            <span className="truncate tracking-tight">{item.name}</span>
          )}

          {isActive && !isCollapsed && (
            <div className="ml-auto h-1 w-1 rounded-full bg-primary" />
          )}
        </div>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "relative flex flex-col border-r border-border/40 bg-card/30 backdrop-blur-xl transition-all duration-500 ease-in-out z-50",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Brand & Toggle Container */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-border/40">
        {!isCollapsed && (
          <div className="flex items-center gap-3 font-bold text-xl tracking-tighter animate-in fade-in slide-in-from-left-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Terminal className="h-6 w-6 text-primary" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
              Dancing DNS
            </span>
          </div>
        )}
        
        {isCollapsed && (
          <div className="mx-auto p-2 rounded-xl bg-primary/10">
            <Terminal className="h-6 w-6 text-primary" />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-4 top-24 h-8 w-8 rounded-full border border-border/60 bg-background shadow-lg hover:bg-primary hover:text-primary-foreground transition-all z-50",
            isCollapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation Space */}
      <div className="flex flex-col flex-1 gap-12 p-4 mt-8 overflow-y-auto custom-scrollbar">
        {/* Main Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-4">
              Dashboard
            </p>
          )}
          {mainNav.map((item) => <NavLink key={item.id} item={item} />)}
        </div>

        {/* Dynamic Domains Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                Managed Domains
              </p>
              {isPending && <Loader2 className="h-3 w-3 animate-spin text-primary/40" />}
            </div>
          )}
          
          {account ? (
            <div className="space-y-1">
              {domainNames.slice(0, 5).map((name, idx) => (
                <NavLink 
                  key={name} 
                  isSubItem
                  item={{
                    id: `domain-${idx}`,
                    name: name,
                    href: `/domains/${domainContracts[idx]}/manage`,
                    icon: Globe
                  }} 
                />
              ))}
              
              {!isPending && domainNames.length > 0 && !isCollapsed && (
                <Link href={`/user/${account.address}`} className="block px-7 mt-2 text-[10px] font-semibold text-primary/80 hover:text-primary transition-colors">
                  View full portfolio ({domainNames.length} domains)
                </Link>
              )}

              {!isPending && domainNames.length === 0 && !isCollapsed && (
                <p className="px-7 py-2 text-[10px] text-muted-foreground/40 italic">
                  No domains registered.
                </p>
              )}
            </div>
          ) : (
            !isCollapsed && (
              <div className="mx-2 px-3 py-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] text-muted-foreground/80 leading-relaxed text-center">
                  Connect your wallet to manage secure decentralized domains.
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Modern Mini Footer */}
      <div className="p-6 border-t border-border/40">
        <div className={cn(
          "flex items-center gap-3 transition-opacity duration-300",
          isCollapsed ? "justify-center" : "px-1"
        )}>
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           {!isCollapsed && (
             <div className="flex flex-col">
               <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/60">System Online</span>
               <span className="text-[10px] font-mono opacity-40">v2.0.4.beta-sepolia</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
