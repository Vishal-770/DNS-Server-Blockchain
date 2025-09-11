"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Shield,
  Globe,
  Zap,
  Lock,
  Code,
  Database,
  Server,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Database className="h-8 w-8 text-primary" />,
      title: "Blockchain Technology",
      description:
        "Built on Ethereum with smart contracts ensuring transparency and immutability of your domain records.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Enhanced Security",
      description:
        "Password-protected records with cryptographic security preventing unauthorized access and modifications.",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Global Accessibility",
      description:
        "Access your domains from anywhere in the world with our decentralized infrastructure.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Lightning Fast",
      description:
        "Optimized DNS resolution with intelligent fallback to traditional DNS systems for maximum reliability.",
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "True Ownership",
      description:
        "You own your domains completely. No central authority can revoke or modify your domains without your consent.",
    },
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Developer Friendly",
      description:
        "RESTful APIs and comprehensive documentation for easy integration with your existing systems.",
    },
  ];

  const recordTypes = [
    {
      type: "A",
      name: "IPv4 Address",
      description: "Maps domain names to IPv4 addresses",
    },
    {
      type: "AAAA",
      name: "IPv6 Address",
      description: "Maps domain names to IPv6 addresses",
    },
    {
      type: "CNAME",
      name: "Canonical Name",
      description: "Creates aliases for domain names",
    },
    {
      type: "TXT",
      name: "Text Records",
      description: "Stores arbitrary text data for verification",
    },
    {
      type: "NS",
      name: "Name Server",
      description: "Specifies authoritative name servers",
    },
    {
      type: "MX",
      name: "Mail Exchange",
      description: "Defines mail server priorities and addresses",
    },
    {
      type: "SRV",
      name: "Service Records",
      description: "Defines service locations and priorities",
    },
  ];

  const techStack = [
    {
      name: "Ethereum",
      description: "Sepolia testnet for smart contract deployment",
    },
    { name: "Solidity", description: "Smart contract development language" },
    {
      name: "Next.js",
      description: "React framework for the frontend application",
    },
    {
      name: "ThirdWeb",
      description: "Web3 development platform for blockchain integration",
    },
    {
      name: "TypeScript",
      description: "Type-safe JavaScript for better development experience",
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first CSS framework for styling",
    },
  ];

  return (
    <div className="min-h-screen bg-background mt-20">
      {/* Hero Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto max-w-6xl text-center space-y-8 animate-fade-in">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Server className="h-4 w-4 mr-2" />
            About Our Platform
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Revolutionizing
            <span className="text-primary block">DNS Management</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our blockchain-powered DNS platform combines the security and
            transparency of blockchain technology with the reliability and speed
            of traditional DNS systems.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              To democratize domain ownership and provide users with complete
              control over their digital identity
            </p>
          </div>

          <Card className="text-center p-12 bg-card border animate-slide-up">
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  We believe that domain ownership should be truly
                  decentralized, secure, and accessible to everyone. Our
                  platform eliminates the need for traditional domain registrars
                  by leveraging blockchain technology to create a transparent,
                  immutable, and user-controlled DNS ecosystem.
                </p>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  With support for all major DNS record types and seamless
                  integration with existing web infrastructure, we&apos;re
                  building the foundation for the next generation of the
                  internet.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Platform Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology for maximum security and
              performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Supported DNS Records
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete support for all standard DNS record types
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recordTypes.map((record, index) => (
              <Card
                key={record.type}
                className="hover:shadow-md transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-sm">
                      {record.type}
                    </Badge>
                    <CardTitle className="text-lg">{record.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{record.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="px-4 py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Technology Stack
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with modern, reliable technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <Card
                key={tech.name}
                className="hover:shadow-md transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{tech.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {tech.description}
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
                  Join the decentralized web revolution and take control of your
                  domains today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link href="/domains">
                  <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                    <Globe className="mr-2 h-5 w-5" />
                    Explore Domains
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
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
