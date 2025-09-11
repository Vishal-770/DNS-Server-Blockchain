"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      content: "support@dns-platform.com",
      description: "Send us an email anytime",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Live Chat",
      content: "Available 24/7",
      description: "Chat with our support team",
    },
    {
      icon: <Github className="h-6 w-6 text-primary" />,
      title: "GitHub",
      content: "github.com/dns-platform",
      description: "View our open source code",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Response Time",
      content: "Within 24 hours",
      description: "We respond to all inquiries quickly",
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

  return (
    <div className="min-h-screen bg-background mt-20">
      {/* Hero Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto max-w-6xl text-center space-y-8 animate-fade-in">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <MessageSquare className="h-4 w-4 mr-2" />
            Get in Touch
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Contact
            <span className="text-primary block">Our Team</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about our DNS platform? Need help with domain
            management? We&apos;re here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Send us a Message
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Contact Form
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What is this regarding?"
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
                        placeholder="Tell us how we can help you..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div
              className="space-y-8 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground">
                  Choose the best way to reach us. We&apos;re here to help with
                  all your DNS and domain needs.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {info.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {info.title}
                          </h3>
                          <p className="text-primary font-medium">
                            {info.content}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Support Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Support Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {supportTopics.map((topic, index) => (
                      <Badge key={index} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Link */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Need Quick Answers?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Check out our documentation and FAQ section for instant
                    solutions.
                  </p>
                  <Button variant="outline">View Documentation</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Response Promise Section */}
      <section className="px-4 py-20 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <Card className="text-center p-12">
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  We&apos;re Here to Help
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Our dedicated support team is committed to providing you with
                  the best possible experience. We respond to all inquiries
                  within 24 hours and provide ongoing support for all our users.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">24 Hour Response</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick reply guarantee
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Expert Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Technical expertise
                  </p>
                </div>
                <div className="text-center">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Global Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Worldwide availability
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
