"use client";

import React, { useState, useEffect } from "react";
import {
  ConnectButton,
  darkTheme,
  lightTheme,
  useActiveAccount,
} from "thirdweb/react";
import client from "@/app/client";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X, Blocks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
interface links {
  name: string;
  href: string;
}
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const account = useActiveAccount();

  useEffect(() => setMounted(true), []);

  const baseLinks: links[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  const navLinks =
    mounted && account
      ? [...baseLinks, { name: "Dashboard", href: `/user/${account.address}` }]
      : baseLinks;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full border-b shadow-sm bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* Left: Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl md:text-2xl font-bold text-primary"
        >
          <Blocks className="h-6 w-6 md:h-8 md:w-8" />
          Dancing DNS
        </Link>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-base md:text-lg font-medium absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="cursor-pointer text-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Desktop Actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {/* ✅ Only show on desktop */}
          <div className="hidden md:block">
            {mounted ? (
              <ConnectButton
                theme={theme === "light" ? lightTheme() : darkTheme()}
                client={client}
              />
            ) : (
              <div style={{ width: 140, height: 40 }} />
            )}
          </div>

          {/* Mobile toggle button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-background border-t"
          >
            <div className="flex flex-col gap-4 px-4 py-4 text-base font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="cursor-pointer text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)} // close after click
                >
                  {link.name}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t my-2" />

              {/* ✅ Only show on mobile */}
              <div className="block md:hidden">
                {mounted ? (
                  <ConnectButton
                    theme={theme === "light" ? lightTheme() : darkTheme()}
                    client={client}
                  />
                ) : (
                  <div style={{ width: 140, height: 40 }} />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
