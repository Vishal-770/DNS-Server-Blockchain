"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Shield,
  Zap,
  Search,
  ArrowRight,
  Server,
  Lock,
  Cpu,
  Fingerprint,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/domains`);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 sm:pt-48 sm:pb-32">
        <div className="container mx-auto max-w-5xl text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">NEW</Badge>
            <span className="text-xs font-medium tracking-wide text-primary/80 uppercase">
              Decentralized DNS V2 is Live
            </span>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 leading-[1.1]">
              Your Identity, <br />
              <span className="text-primary italic">De-centralized.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The world’s first high-performance DNS resolver powered by blockchain security. 
              Own your domain, control your records, and resolve in under 60ms.
            </p>
          </div>

          {/* Search Area */}
          <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <form onSubmit={handleSearch} className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/50 to-primary/30 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
              <div className="relative flex items-center gap-2 p-2 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-xl shadow-2xl">
                <Search className="ml-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="text"
                  placeholder="Search for a domain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent text-lg focus-visible:ring-0 placeholder:text-muted-foreground/50 h-12"
                />
                <Button type="submit" size="lg" className="rounded-xl px-8 font-semibold shadow-lg shadow-primary/20">
                  Search
                </Button>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground/60">
              <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> Fully Audited</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3 w-3" /> 60ms Latency</span>
              <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> P53 Security</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <Link href="/domains">
              <Button variant="outline" size="lg" className="rounded-xl px-8 border-border/50 bg-secondary/10 hover:bg-secondary/20 backdrop-blur">
                Explore Domains
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "On-Chain Registry",
                desc: "Records are stored as smart contract state. No centralized registrar can take your domain down.",
                icon: Cpu,
                color: "text-primary"
              },
              {
                title: "Flash Resolution",
                desc: "Redis-accelerated hybrid resolvers ensure decentralized queries match traditional DNS speeds.",
                icon: Zap,
                color: "text-primary"
              },
              {
                title: "Password Protection",
                desc: "Every record mutation requires your master password and blockchain signature. Security first.",
                icon: Fingerprint,
                color: "text-primary"
              }
            ].map((f, i) => (
              <Card key={i} className="group relative overflow-hidden border-border/50 bg-card transition-all hover:bg-card/80 hover:-translate-y-1">
                <CardContent className="p-8 space-y-4">
                  <div className={`p-3 rounded-xl bg-primary/10 w-fit ${f.color}`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="relative z-10 py-20 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="container mx-auto max-w-6xl text-center space-y-12">
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground/60">
            Compatible with modern protocols
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-24 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
             <div className="flex items-center gap-2 text-2xl font-bold"><Globe className="h-8 w-8 text-primary" /> ICANN</div>
             <div className="flex items-center gap-2 text-2xl font-bold"><Shield className="h-8 w-8 text-primary" /> DNSSEC</div>
             <div className="flex items-center gap-2 text-2xl font-bold"><Cpu className="h-8 w-8 text-primary" /> Web3</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-xl">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Globe className="h-48 w-48 text-primary" />
             </div>
             <CardContent className="p-12 text-center space-y-8">
               <h2 className="text-3xl sm:text-5xl font-bold">Ready to take control?</h2>
               <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                 Join thousands of users securing their infrastructure on the new open DNS network.
               </p>
               <Link href="/domains" className="inline-block">
                 <Button size="lg" className="rounded-xl px-12 py-7 text-lg font-bold shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">
                   Manage My Domains <ArrowRight className="ml-2 h-5 w-5" />
                 </Button>
               </Link>
             </CardContent>
          </Card>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Server className="h-6 w-6 text-primary" /> DNS Platform
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <Link href="/about" className="hover:text-primary transition-colors">Whitepaper</Link>
            <Link href="/domains" className="hover:text-primary transition-colors">Network</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Build</Link>
          </div>
          <div className="text-xs text-muted-foreground/40 font-mono">
            BLOCKCHAIN_IDENTITY_V2.0.4
          </div>
        </div>
      </footer>
    </div>
  );
}
