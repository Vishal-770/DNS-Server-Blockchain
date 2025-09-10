"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Twitter,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const footerLinks = {
    Product: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
    ],
    Resources: [
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" },
      { name: "Security", href: "/security" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  };

  const socialLinks = [
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      href: "https://twitter.com",
    },
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://linkedin.com",
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      href: "mailto:hello@dnsdao.com",
    },
  ];

  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Stay Updated
              </h3>
              <p className="text-muted-foreground max-w-md">
                Get the latest updates on blockchain DNS technology and new
                features.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[400px]">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-11 bg-background"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground group">
                Subscribe
                <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                DNS DAO
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Revolutionizing domain name systems with blockchain technology.
              Secure, decentralized, and truly owned by you.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">hello@dnsdao.com</span>
              </div>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="sm"
                  className="p-2 h-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-foreground font-semibold">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm group flex items-center"
                    >
                      {link.name}
                      <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
              <span>© 2025 DNS DAO. All rights reserved.</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Blockchain Powered
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  Beta v1.0
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/status"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
