"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  Globe,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Server,
  Rocket,
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

  const features = [
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Decentralized DNS",
      description:
        "Manage your domains on the blockchain with full ownership and control.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Enhanced Security",
      description:
        "Password-protected records and blockchain-level security for your domains.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Lightning Fast",
      description:
        "Quick DNS resolution with fallback to traditional DNS systems.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "User Friendly",
      description: "Simple interface for managing complex DNS configurations.",
    },
  ];

  const recordTypes = [
    { type: "A", description: "IPv4 Address records" },
    { type: "AAAA", description: "IPv6 Address records" },
    { type: "CNAME", description: "Canonical Name records" },
    { type: "TXT", description: "Text records for verification" },
    { type: "NS", description: "Name Server records" },
    { type: "MX", description: "Mail Exchange records" },
    { type: "SRV", description: "Service records" },
  ];

  return (
    <div className="min-h-screen bg-background mt-16">
      {/* Hero Section */}
      <section className="relative px-4 py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Blockchain DNS Platform
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
              Decentralized
              <span className="text-primary block">DNS Management</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Take control of your domains with our blockchain-powered DNS
              platform. Secure, transparent, and truly decentralized domain
              management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/domains">
                <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                  Explore Domains
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of domain management with blockchain
              technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DNS Records Section */}
      <section className="px-4 py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Supported DNS Records
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive support for all major DNS record types
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recordTypes.map((record, index) => (
              <Card
                key={record.type}
                className="hover:shadow-md transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono text-sm">
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

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <Card className="text-center p-12 bg-primary/5 border-primary/20">
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join the decentralized web and take control of your domains
                  today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link href="/domains">
                  <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                    <Server className="mr-2 h-5 w-5" />
                    Manage Domains
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    Contact Support
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
