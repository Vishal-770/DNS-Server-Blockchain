"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Globe,
  Users,
  Target,
  Heart,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Award,
  Lock,
} from "lucide-react";

export default function About() {
  const team = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      image: "🚀",
      description: "Blockchain pioneer with 10+ years in decentralized systems",
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      image: "💻",
      description:
        "Expert in DNS protocols and distributed network architecture",
    },
    {
      name: "Mike Rodriguez",
      role: "Lead Developer",
      image: "⚡",
      description: "Full-stack developer specializing in Web3 technologies",
    },
    {
      name: "Emily Parker",
      role: "Security Lead",
      image: "🔒",
      description:
        "Cybersecurity expert ensuring blockchain infrastructure safety",
    },
  ];

  const values = [
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Security First",
      description:
        "Every line of code is written with security as the top priority.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "User Empowerment",
      description:
        "We believe in giving users complete control over their digital assets.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description:
        "Constantly pushing the boundaries of what's possible with blockchain DNS.",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Community",
      description:
        "Building technology that serves and empowers our global community.",
    },
  ];

  const milestones = [
    {
      year: "2021",
      title: "Project Inception",
      description: "First blockchain DNS prototype developed",
    },
    {
      year: "2022",
      title: "Alpha Launch",
      description: "Closed alpha testing with 100 early adopters",
    },
    {
      year: "2023",
      title: "Beta Release",
      description: "Public beta with 1,000+ active domains",
    },
    {
      year: "2024",
      title: "Mainnet Launch",
      description: "Full production release with enterprise features",
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "10,000+ domains and growing worldwide",
    },
  ];

  return (
    <div className="min-h-screen bg-background mt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Badge
              variant="outline"
              className="mb-4 animate-in fade-in delay-200"
            >
              <Globe className="h-3 w-3 mr-1" />
              About Our Mission
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight animate-in fade-in slide-in-from-bottom-6 delay-300">
              Revolutionizing
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                DNS Technology
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 delay-500">
              We&apos;re building the future of domain name systems on
              blockchain technology. Our mission is to create a more secure,
              transparent, and user-controlled internet infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            <Card className="p-8 border-0 bg-card/50 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-left-6 delay-200">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Our Mission
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  To democratize internet infrastructure by providing
                  decentralized DNS solutions that give users true ownership and
                  control over their digital identity.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">
                      Eliminate single points of failure
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">
                      Ensure censorship resistance
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">
                      Provide transparent operations
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border-0 bg-card/50 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-right-6 delay-400">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Our Vision
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  A world where every internet user has complete sovereignty
                  over their digital presence, powered by decentralized, secure,
                  and transparent blockchain technology.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">
                      Global DNS decentralization
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">
                      Universal digital ownership
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">
                      Internet freedom for all
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 delay-200">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and build.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 animate-in fade-in slide-in-from-bottom-6"
                style={{ animationDelay: `${index * 150 + 400}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 delay-200">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Key milestones in our mission to decentralize DNS.
            </p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className="flex gap-8 animate-in fade-in slide-in-from-left-6"
                style={{ animationDelay: `${index * 200 + 400}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-4 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {milestone.year}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 delay-200">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals building the future of decentralized
              DNS.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={member.name}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 animate-in fade-in slide-in-from-bottom-6"
                style={{ animationDelay: `${index * 150 + 400}ms` }}
              >
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {member.image}
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mb-4">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="animate-in fade-in slide-in-from-bottom-6 delay-200">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Join Our Mission
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Be part of the decentralized DNS revolution. Help us build a more
              open, secure, and user-controlled internet infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Start Using DNS
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
