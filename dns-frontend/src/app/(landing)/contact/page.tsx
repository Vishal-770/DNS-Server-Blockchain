"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { toast } from "sonner";
import {
  Mail,
  MessageSquare,
  Send,
  Clock,
  Github,
  Globe,
  Shield,
  PhoneCall,
  Workflow,
  Users,
  ArrowRight,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      Icon: Mail,
      title: "Email",
      content: "support@dns-platform.com",
      description: "Get a detailed reply within 24 hours",
    },
    {
      Icon: MessageSquare,
      title: "Live chat",
      content: "Available 24/7",
      description: "Chat with a support engineer in minutes",
    },
    {
      Icon: PhoneCall,
      title: "Hotline",
      content: "+91 98765 43210",
      description: "Escalations and enterprise incidents",
    },
    {
      Icon: Github,
      title: "GitHub",
      content: "github.com/dns-platform",
      description: "Browse issues, raise PRs, and track releases",
    },
  ];

  const supportTopics = [
    "Domain Management",
    "DNS Configuration",
    "Blockchain Integration",
    "Technical Support",
    "Account Issues",
    "API Documentation",
  ];

  const responseHighlights = [
    {
      Icon: Clock,
      title: "Median first reply",
      value: "3 hrs",
    },
    {
      Icon: Shield,
      title: "Critical uptime",
      value: "99.9%",
    },
    {
      Icon: Workflow,
      title: "Automated workflows",
      value: "12",
    },
    {
      Icon: Users,
      title: "Global advocates",
      value: "25+",
    },
  ];

  return (
    <div className="min-h-screen bg-background mt-20">
      <section className="relative overflow-hidden px-4 py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute -top-24 right-12 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-primary/10 blur-2xl" />

        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              We respond faster than your TTL expires
            </Badge>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Talk to the team behind your decentralized DNS infrastructure
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              From integration walkthroughs to incident response, our support
              crew keeps your domains online and your stakeholders informed.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {responseHighlights.map(({ Icon, title, value }) => (
              <Card
                key={title}
                className="border border-primary/20 bg-background/90 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="space-y-3 p-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {value}
                  </div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-semibold">
                  Send us a message
                </h2>
                <p className="text-muted-foreground">
                  Share as many details as possible and we&apos;ll pair you with
                  the right specialist. Enterprise support customers jump to the
                  front of the queue automatically.
                </p>
              </div>

              <Card className="border border-border/70 bg-background/95 shadow-sm">
                <CardContent className="space-y-6 p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Work email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">How can we help? *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Share a short headline"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        placeholder="Add relevant context, timelines, and any links to repos or dashboards."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="flex w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-muted-foreground">
                      <strong className="text-primary">Heads up:</strong>{" "}
                      include your domain address or smart contract hash so we
                      can pull logs instantly.
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Sending message…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-semibold">
                  Choose the best channel
                </h2>
                <p className="text-muted-foreground">
                  Whether you&apos;re deploying your first CN-ready resolver or
                  scaling to millions of queries, our global team is available
                  across multiple touchpoints.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {contactInfo.map(({ Icon, title, content, description }) => (
                  <Card
                    key={title}
                    className="border border-border/70 bg-background/95 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <CardContent className="space-y-3 p-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2.5">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {title}
                          </h3>
                          <p className="text-sm text-primary font-medium">
                            {content}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border border-border/70 bg-background/95">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Expertise on demand
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {supportTopics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="rounded-full px-3 py-1 text-xs"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
                <CardContent className="space-y-4 p-6 text-center">
                  <Globe className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Looking for documentation?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Browse SDK references, resolver deployment guides, and
                    troubleshooting checklists curated for CN projects.
                  </p>
                  <Button variant="outline" className="gap-2">
                    View documentation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/20 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <Card className="border border-border/70 bg-background/95 text-center shadow-sm">
            <CardContent className="space-y-6 p-10">
              <Badge variant="secondary" className="uppercase tracking-wide">
                Always-on support
              </Badge>
              <h2 className="text-3xl md:text-4xl font-semibold">
                We treat your DNS like core network infrastructure—because it is
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Proactive monitoring, runbook-driven responses, and a human
                on-call rotation mean you&apos;re never left waiting when every
                millisecond matters.
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Clock className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="font-semibold">24/7 coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow-the-sun support desks across three regions.
                  </p>
                </div>
                <div className="space-y-2">
                  <Shield className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="font-semibold">Incident playbooks</h3>
                  <p className="text-sm text-muted-foreground">
                    Battle-tested runbooks for DNS, blockchain, and resolver
                    layers.
                  </p>
                </div>
                <div className="space-y-2">
                  <Users className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="font-semibold">Dedicated success manager</h3>
                  <p className="text-sm text-muted-foreground">
                    Enterprise plans include quarterly architecture reviews.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
