"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Menu, X } from "lucide-react";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-sm border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">Agentra</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#agents"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              AI Agents
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button variant="gradient" size="sm" asChild>
              <Link href="/sign-up">Get started free</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border/50 px-4 py-4 space-y-3">
          <Link href="#features" className="block text-sm font-medium py-2">Features</Link>
          <Link href="#agents" className="block text-sm font-medium py-2">AI Agents</Link>
          <Link href="#pricing" className="block text-sm font-medium py-2">Pricing</Link>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button variant="gradient" size="sm" className="flex-1" asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
