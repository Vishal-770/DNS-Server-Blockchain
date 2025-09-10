"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Send,
  Clock,
  Users,
  Headphones,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@dnsdao.com",
      action: "Send Email",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Live Chat",
      description: "Chat with our team in real-time",
      contact: "Available 24/7",
      action: "Start Chat",
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone Support",
      description: "Speak directly with our experts",
      contact: "+1 (555) 123-4567",
      action: "Call Now",
    },
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Blockchain Street, Suite 100",
      timezone: "PST (UTC-8)",
      hours: "9 AM - 6 PM",
    },
    {
      city: "London",
      address: "456 Decentralized Ave, Floor 5",
      timezone: "GMT (UTC+0)",
      hours: "9 AM - 6 PM",
    },
    {
      city: "Singapore",
      address: "789 Web3 Boulevard, Tower A",
      timezone: "SGT (UTC+8)",
      hours: "9 AM - 6 PM",
    },
  ];

  const faqs = [
    {
      question: "How does blockchain DNS work?",
      answer:
        "Blockchain DNS stores domain records on a distributed ledger, ensuring immutability and decentralization.",
    },
    {
      question: "Is it compatible with existing DNS?",
      answer:
        "Yes, our system provides backward compatibility while offering enhanced security and ownership.",
    },
    {
      question: "What are the costs involved?",
      answer:
        "Transaction fees are minimal, typically under $1, with no recurring subscription fees.",
    },
    {
      question: "How secure is my domain?",
      answer:
        "Your domain is secured by blockchain cryptography, making it virtually impossible to hack or steal.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success(
        "Message sent successfully! We'll get back to you within 24 hours."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
              <Headphones className="h-3 w-3 mr-1" />
              24/7 Support Available
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight animate-in fade-in slide-in-from-bottom-6 delay-300">
              Get in
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 delay-500">
              Have questions about blockchain DNS? Need help with your domains?
              Our expert team is here to assist you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 delay-200">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Can We Help?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the contact method that works best for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card
                key={method.title}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 animate-in fade-in slide-in-from-bottom-6"
                style={{ animationDelay: `${index * 150 + 400}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground mb-2">
                    {method.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">
                    {method.description}
                  </p>
                  <Badge variant="outline" className="mb-4">
                    {method.contact}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <Button className="w-full group">
                    {method.action}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Info */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-in fade-in slide-in-from-left-6 delay-200">
              <Card className="p-8 border-0 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <Send className="h-6 w-6 text-primary" />
                    Send us a Message
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we&apos;ll get back to you as
                    soon as possible.
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-foreground"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground"
                        >
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="text-sm font-medium text-foreground"
                      >
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-sm font-medium text-foreground"
                      >
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Office Information */}
            <div className="space-y-8 animate-in fade-in slide-in-from-right-6 delay-400">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  Our Offices
                </h3>
                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <Card
                      key={office.city}
                      className="p-6 border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-right-4"
                      style={{ animationDelay: `${index * 100 + 600}ms` }}
                    >
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {office.city}
                      </h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>{office.address}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{office.hours}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {office.timezone}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card
                      key={faq.question}
                      className="p-6 border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-right-4"
                      style={{ animationDelay: `${index * 100 + 800}ms` }}
                    >
                      <h4 className="text-base font-semibold text-foreground mb-2 flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        {faq.question}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed ml-8">
                        {faq.answer}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Stats */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 delay-200">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Support You Can Count On
            </h2>
            <p className="text-lg text-muted-foreground">
              Our commitment to exceptional customer service.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Clock className="h-6 w-6" />,
                value: "< 2hrs",
                label: "Avg Response Time",
              },
              {
                icon: <Users className="h-6 w-6" />,
                value: "98%",
                label: "Customer Satisfaction",
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                value: "24/7",
                label: "Support Available",
              },
              {
                icon: <Headphones className="h-6 w-6" />,
                value: "5+",
                label: "Languages Supported",
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
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
    </div>
  );
}
