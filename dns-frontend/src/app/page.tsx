"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Lock,
  Rocket,
  Network,
  Database,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Decentralized DNS",
      description:
        "Manage your domain names on the blockchain with complete ownership and control.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Immutable",
      description:
        "Your DNS records are secured by blockchain technology, ensuring they can't be tampered with.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Lightning Fast",
      description:
        "Experience blazing fast DNS resolution with our optimized blockchain infrastructure.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "User Friendly",
      description:
        "Intuitive interface makes blockchain DNS management accessible to everyone.",
    },
  ];

  const stats = [
    {
      label: "Active Domains",
      value: "10,000+",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      label: "DNS Records",
      value: "50,000+",
      icon: <Database className="h-5 w-5" />,
    },
    {
      label: "Uptime",
      value: "99.9%",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      label: "Response Time",
      value: "<50ms",
      icon: <Zap className="h-5 w-5" />,
    },
  ];

  const benefits = [
    "True domain ownership - No intermediaries",
    "Censorship resistant DNS records",
    "Global accessibility and reliability",
    "Transparent and verifiable transactions",
    "Lower costs compared to traditional DNS",
    "Future-proof blockchain technology",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="container mx-auto px-4 py-20 md:py-32 max-w-7xl relative">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Badge
              variant="outline"
              className="mb-4 animate-in fade-in delay-200"
            >
              <Rocket className="h-3 w-3 mr-1" />
              Powered by Blockchain Technology
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight animate-in fade-in slide-in-from-bottom-6 delay-300">
              Decentralized
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                DNS Management
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 delay-500">
              Take control of your digital identity with blockchain-powered DNS.
              Secure, transparent, and truly owned by you. No more middlemen, no
              more restrictions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 delay-700">
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 delay-100"
                style={{ animationDelay: `${index * 100 + 800}ms` }}
              >
                <div className="flex justify-center text-primary mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 delay-200">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose Blockchain DNS?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of domain name system with
              unprecedented security and control.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 animate-in fade-in slide-in-from-bottom-6"
                style={{ animationDelay: `${index * 150 + 400}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in slide-in-from-left-6 delay-200">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                The Future of DNS is Here
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Traditional DNS systems are centralized, vulnerable, and
                controlled by corporations. Our blockchain-powered solution
                gives you complete ownership and control over your digital
                identity.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4"
                    style={{ animationDelay: `${index * 100 + 600}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-in fade-in slide-in-from-right-6 delay-400">
              <Card className="p-8 border-0 bg-card/50 backdrop-blur-sm shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Network className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Decentralized Architecture
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our distributed network ensures your domains are always
                    accessible, censorship-resistant, and under your complete
                    control.
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="animate-in fade-in slide-in-from-bottom-6 delay-200">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Join thousands of users who have already moved to decentralized
              DNS. Start your journey towards true digital ownership today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Start Managing DNS
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
