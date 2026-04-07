"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Shield,
  Globe,
  Zap,
  Server,
  ArrowRight,
  Layers,
  TimerReset,
  BookOpen,
} from "lucide-react";

const missionSteps = [
  {
    title: "Secure ownership",
    description:
      "Each domain is deployed as its own smart contract, guarded by on-chain permissions and a password hash overseen by the owner.",
  },
  {
    title: "Programmable DNS records",
    description:
      "Support for A, AAAA, CNAME, MX, TXT, NS, and SRV records gives operators full control without relying on centralized registrars.",
  },
  {
    title: "Hybrid resolution engine",
    description:
      "A resilient Node.js resolver queries the blockchain first, caches responses in Redis, and gracefully falls back to traditional DNS when needed.",
  },
];

const pillars = [
  {
    Icon: Shield,
    label: "Immutability",
    description:
      "Tamper-proof ownership and record updates with auditable smart contract events.",
  },
  {
    Icon: Zap,
    label: "Performance",
    description:
      "Redis caching, IP rate limiting, and upstream failover keep resolution under 60ms on average.",
  },
  {
    Icon: Globe,
    label: "Accessibility",
    description:
      "Wallet-based onboarding, responsive dashboards, and global edge-ready infrastructure.",
  },
];

const recordTypes = [
  {
    type: "A",
    name: "IPv4 address",
    description: "Map domains to IPv4 endpoints and load balancers.",
  },
  {
    type: "AAAA",
    name: "IPv6 address",
    description: "Native support for modern IPv6-first environments.",
  },
  {
    type: "CNAME",
    name: "Canonical name",
    description: "Create resilient aliases and simplify multi-region routing.",
  },
  {
    type: "TXT",
    name: "Text records",
    description: "Distribute verification tokens, SPF rules, and metadata.",
  },
  {
    type: "NS",
    name: "Name server",
    description: "Delegate authority to custom infrastructure when required.",
  },
  {
    type: "MX",
    name: "Mail exchange",
    description: "Prioritize secure email delivery with multi-tier routing.",
  },
  {
    type: "SRV",
    name: "Service record",
    description:
      "Advertise ports and protocols for advanced service discovery.",
  },
];

const techStack = [
  {
    name: "Ethereum + zkSync",
    description:
      "Smart contracts deployed to Sepolia test networks with zkSync tooling for scalability.",
  },
  {
    name: "Solidity",
    description:
      "Domain and factory contracts enforced with explicit access control and CNAME fallbacks.",
  },
  {
    name: "Next.js 15",
    description:
      "App Router-based frontend with streaming, nested layouts, and Turbopack builds.",
  },
  {
    name: "Thirdweb SDK",
    description:
      "Wallet connection, contract reads, and prepared transactions with a single hook.",
  },
  {
    name: "Redis Cloud",
    description:
      "High-throughput caching and rate limiting for the DNS resolver layer.",
  },
  {
    name: "Tailwind + Radix",
    description:
      "Composable UI primitives, motion, and accessible components across the dashboard.",
  },
];

const timelineStats = [
  {
    Icon: Layers,
    title: "Modular by design",
    description:
      "Per-domain contracts, factory deployment, and resolver services remain loosely coupled.",
  },
  {
    Icon: TimerReset,
    title: "Real-time updates",
    description:
      "Record changes reflect instantly in cached lookups with minute-long TTLs.",
  },
  {
    Icon: BookOpen,
    title: "Transparent tooling",
    description:
      "Detailed docs, typed SDKs, and sharable components lower the barrier for integrators.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background mt-20">
      <section className="relative overflow-hidden px-4 py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute -top-32 right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 left-12 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />

        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              <Server className="mr-2 h-4 w-4" />
              The story behind our CN DNS stack
            </Badge>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Purpose-built infrastructure for sovereign DNS ownership
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              We combine smart contracts, a hybrid resolver, and a polished
              management experience so that teams can ship decentralized DNS
              without sacrificing reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map(({ Icon, label, description }) => (
              <Card
                key={label}
                className="border border-primary/20 bg-background/90 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-base font-semibold">{label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Our mission is simple: decentralize trust without losing usability
            </h2>
            <p className="text-muted-foreground">
              From the first contract deployment to the thousands of DNS queries
              our resolver answers each minute, we obsess over keeping the
              experience intuitive and production-grade.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {missionSteps.map((step, index) => (
              <Card
                key={step.title}
                className="relative overflow-hidden border border-border/70 bg-background/95 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary via-primary/60 to-transparent" />
                <CardContent className="space-y-2 p-8 sm:flex sm:flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Step {index + 1}
                  </span>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Platform at a glance
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              An end-to-end CN project: from contract security to resolver
              throughput, every piece is engineered for predictable operations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {timelineStats.map(({ Icon, title, description }) => (
              <Card
                key={title}
                className="border border-border/70 bg-background/95 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-7">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Supported DNS records
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage the entire spectrum of DNS metadata straight from the
              dashboard with password-protected operations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recordTypes.map((record) => (
              <Card
                key={record.type}
                className="border border-border/70 bg-background/95 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs">
                      {record.type}
                    </Badge>
                    <span className="text-sm font-medium">{record.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {record.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/20 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Technology stack
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Modern tooling keeps shipping velocity high while preserving the
              rigor expected in CN-grade infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech) => (
              <Card
                key={tech.name}
                className="border border-border/70 bg-background/95 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="space-y-3 p-6">
                  <h3 className="text-lg font-semibold">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tech.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <Card className="overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
            <CardContent className="space-y-6 p-10 text-center md:text-left md:flex md:flex-col md:items-center">
              <Badge
                variant="secondary"
                className="w-fit uppercase tracking-wide"
              >
                Ready when you are
              </Badge>
              <h2 className="text-3xl md:text-4xl font-semibold">
                Bring decentralized DNS to production with confidence
              </h2>
              <p className="text-muted-foreground max-w-3xl">
                Deploy the contracts, wire the resolver, and empower operators
                with a pro-grade management console. Everything you need ships
                in this repository.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Link href="/domains">
                  <Button size="lg" className="gap-2">
                    <Globe className="h-5 w-5" />
                    Explore domains
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="gap-2">
                    <ArrowRight className="h-5 w-5" />
                    Talk to the team
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
