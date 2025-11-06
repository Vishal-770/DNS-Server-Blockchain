"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Server,
  Rocket,
  Search,
  BookOpen,
  LifeBuoy,
  CreditCard,
  Wallet,
  Bot,
  Sparkles,
  FileCode,
  ArrowUpRight,
} from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-primary/5 rounded-full blur-lg animate-pulse delay-1000" />

        <div className="text-center space-y-8 animate-fade-in max-w-lg mx-auto px-6 relative z-10">
          {/* Enhanced spinner with glow effect */}
          <div className="relative flex justify-center">
            <div className="relative">
              <LoadingSpinner size="lg" />
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="absolute inset-2 bg-primary/10 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Title and description */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Loading DNS Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Preparing your decentralized domain experience...
            </p>
          </div>

          {/* Animated dots */}
          <div className="flex justify-center items-center space-x-3">
            <div className="h-3 w-3 bg-primary rounded-full animate-bounce" />
            <div className="h-3 w-3 bg-primary rounded-full animate-bounce delay-200" />
            <div className="h-3 w-3 bg-primary rounded-full animate-bounce delay-400" />
          </div>

          {/* Progress indicators */}
          <div className="space-y-3 mt-8">
            <div className="flex justify-center items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Connecting to blockchain...</span>
            </div>
            <div className="w-48 mx-auto bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full animate-loading-progress" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Kickstart your DNS dApp",
      description:
        "Deploy contracts, mint domains, and configure records without leaving the dashboard.",
      href: "/domains",
      cta: "Launch domain studio",
      Icon: Rocket,
    },
    {
      title: "Browse docs & SDKs",
      description:
        "Explore guides, TypeScript SDKs, and UI components tailored for decentralized DNS flows.",
      href: "/about",
      cta: "View documentation",
      Icon: BookOpen,
    },
    {
      title: "Ask for guidance",
      description:
        "Reach out to our team or tap into AI-powered assistants for rapid troubleshooting.",
      href: "/contact",
      cta: "Contact support",
      Icon: LifeBuoy,
    },
  ];

  const documentationSections = [
    {
      title: "Wallets",
      description:
        "Authenticate users, manage sessions, and secure sign-ins across devices.",
      topics: ["Wallets", "Wallet Connection", "Chain"],
      Icon: Wallet,
    },
    {
      title: "Transactions",
      description:
        "Trigger gasless writes, stream analytics, and configure payment rails.",
      topics: ["Transactions", "Payments", "Bridge"],
      Icon: CreditCard,
    },
    {
      title: "Contracts",
      description:
        "Launch factories, extend modules, and automate upgrades with guardrails.",
      topics: ["Contracts", "Extensions", "Modules"],
      Icon: FileCode,
    },
    {
      title: "Tokens & APIs",
      description:
        "Mint assets, power insights, and tap directly into our high-throughput APIs.",
      topics: ["Tokens", "API Reference", "SDKs"],
      Icon: Sparkles,
    },
    {
      title: "Automation & AI",
      description:
        "Prototype faster with AI copilots, scripted workflows, and builder tools.",
      topics: ["AI", "Tools", "Utils"],
      Icon: Bot,
    },
    {
      title: "Operations",
      description:
        "Track releases, stay compliant, and keep contributors in the loop.",
      topics: ["Support", "Changelog", "UI Components"],
      Icon: LifeBuoy,
    },
  ];

  const features = [
    {
      title: "Sovereign ownership",
      badge: "Security",
      description:
        "Each domain runs on its own smart contract with owner/password gating for every mutation.",
      Icon: Shield,
    },
    {
      title: "Resilient performance",
      badge: "Reliability",
      description:
        "Redis caching, per-IP rate limiting, and upstream failovers keep lookups snappy under load.",
      Icon: Zap,
    },
    {
      title: "Design system ready",
      badge: "Experience",
      description:
        "Responsive Next.js + Tailwind foundation with dark mode, motion, and reusable UI primitives.",
      Icon: Users,
    },
  ];

  const recordTypes = [
    { type: "A", description: "Map domains to IPv4 addresses" },
    {
      type: "AAAA",
      description: "Native IPv6 compatibility for modern networks",
    },
    { type: "CNAME", description: "Alias domains and streamline redirects" },
    { type: "TXT", description: "Embed verification and metadata records" },
    { type: "NS", description: "Delegate authoritative name servers" },
    { type: "MX", description: "Prioritize secure mail routing" },
    { type: "SRV", description: "Expose advanced service discovery" },
  ];

  const supportLinks = [
    {
      title: "Stay in the loop",
      description:
        "Follow release notes and roadmap updates directly from the core team.",
      href: "/about",
      cta: "View changelog",
      Icon: Sparkles,
    },
    {
      title: "Build with confidence",
      description:
        "Chat with support, request features, or schedule integration workshops.",
      href: "/contact",
      cta: "Open support desk",
      Icon: LifeBuoy,
    },
  ];

  const transactionSnippet = `import { TransactionButton } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";

<TransactionButton
  className="w-full rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
  transaction={async () =>
    prepareContractCall({
      contract,
      method: "function addRecord(string recordType, string value, string password)",
      params: ["A", "1.1.1.1", "super-secure-password"],
    })
  }
  onTransactionSent={() => toast("Transaction submitted")}
  onTransactionConfirmed={() => toast.success("Record live on-chain")}
  onError={(error) => toast.error(error.message)}
>
  Publish record
</TransactionButton>;`;

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background mt-16">
      <section className="relative overflow-hidden px-4 pt-24 pb-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-background to-background" />
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />

        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Builder docs hub
            </Badge>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Everything you need to ship decentralized DNS experiences
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Explore reference guides, ready-to-use components, and production
              patterns that connect wallet onboarding, contract automations, and
              DNS record management.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="mx-auto max-w-3xl"
            role="search"
            aria-label="Documentation search"
          >
            <div className="group relative flex items-center gap-3 rounded-2xl border border-primary/30 bg-background/70 p-3 shadow-xl shadow-primary/10 backdrop-blur">
              <Search className="h-5 w-5 text-primary" />
              <Input
                placeholder="Search docs, SDKs, or UI components"
                className="border-0 bg-transparent text-base focus-visible:ring-0"
              />
              <Button type="submit" size="lg" className="rounded-xl">
                Search docs
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Owner-only smart
              contract writes
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Redis-cached DNS
              responses under 60 ms
            </span>
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Hybrid resolver with
              upstream fallback
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-semibold">
                Start building in minutes
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Curated entry points for engineers, product teams, and operators
                handling blockchain DNS workloads.
              </p>
            </div>
            <Badge className="w-fit px-4 py-2 text-xs uppercase tracking-wide">
              End-to-end workflow
            </Badge>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {quickActions.map(({ title, description, href, cta, Icon }) => (
              <Card
                key={title}
                className="group relative overflow-hidden border border-primary/20 bg-background/90 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="space-y-6 p-8">
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <Link href={href} className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-primary"
                    >
                      {cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
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
              Documentation map
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Deep-dive into the areas that matter most—from wallet onboarding
              to AI-assisted deployment suites.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {documentationSections.map(
              ({ title, description, topics, Icon }) => (
                <Card
                  key={title}
                  className="h-full border border-border/60 bg-background/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <CardContent className="flex h-full flex-col gap-5 p-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2.5">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground flex-1">
                      {description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="rounded-full px-3 py-1 text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map(({ title, description, Icon, badge }) => (
              <Card
                key={title}
                className="relative overflow-hidden border border-border/70 bg-background/95 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/30" />
                <CardContent className="space-y-5 p-7">
                  <Badge
                    variant="secondary"
                    className="w-fit uppercase tracking-wide"
                  >
                    {badge}
                  </Badge>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/20 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <Card className="overflow-hidden border border-primary/30 bg-background/95 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <CardContent className="space-y-6 p-8">
                <Badge
                  variant="outline"
                  className="w-fit uppercase tracking-wide"
                >
                  Component spotlight
                </Badge>
                <h3 className="text-2xl font-semibold">
                  Ship transactions with a single reusable button
                </h3>
                <p className="text-muted-foreground">
                  The `TransactionButton` handles user prompts, submission
                  states, and receipt confirmations out of the box. Style it,
                  plug in a prepared contract call, and let the SDK orchestrate
                  the rest.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    Gasless, pay-modal aware workflows with optional callbacks
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    First-class TypeScript support and auto-generated ABIs
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    Native toast integration for success and failure states
                  </li>
                </ul>
                <Link href="/domains" className="inline-flex">
                  <Button size="lg" className="gap-2">
                    Try it in the manager
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
              <div className="border-t border-border/60 bg-muted/40 md:border-t-0 md:border-l">
                <pre className="h-full w-full overflow-x-auto p-6 text-sm leading-relaxed">
                  <code>{transactionSnippet}</code>
                </pre>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Supported DNS records
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deploy once and manage every critical record type used by modern
              infrastructure teams.
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
                    <CheckCircle className="h-4 w-4 text-primary" />
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

      <section className="bg-primary/5 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {supportLinks.map(({ title, description, cta, href, Icon }) => (
              <Card
                key={title}
                className="border border-primary/20 bg-background/95 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="space-y-5 p-7">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  <Link href={href} className="inline-flex">
                    <Button variant="ghost" className="gap-2 text-primary">
                      {cta}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
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
                Launch faster
              </Badge>
              <h2 className="text-3xl md:text-4xl font-semibold">
                Bring decentralized DNS to your product roadmap today
              </h2>
              <p className="text-muted-foreground max-w-3xl">
                Deploy the contracts, point traffic to the hybrid resolver, and
                empower your team with a polished management console—all from a
                single open-source stack.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Link href="/domains">
                  <Button size="lg" className="gap-2">
                    <Server className="h-5 w-5" />
                    Manage domains
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="gap-2">
                    <BookOpen className="h-5 w-5" />
                    Read the docs
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
