"use client";

import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function DashboardHeader({ title, description, action }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border/60 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/50 text-muted-foreground text-sm w-52 cursor-pointer hover:bg-muted transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search...</span>
          <div className="ml-auto flex items-center gap-0.5 text-xs opacity-50">
            <kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-background text-xs">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-background text-xs">K</kbd>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </button>

        {/* Action */}
        {action && (
          <Button variant="gradient" size="sm" asChild={!!action.href}>
            {action.href ? (
              <Link href={action.href}>
                <Plus className="w-4 h-4" />
                {action.label}
              </Link>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {action.label}
              </>
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
