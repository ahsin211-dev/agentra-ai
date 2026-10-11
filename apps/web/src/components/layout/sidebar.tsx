"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  BarChart3,
  BookOpen,
  Settings,
  Sparkles,
  Zap,
  Key,
  Users,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Agents",
    href: "/agents",
    icon: Bot,
  },
  {
    label: "Conversations",
    href: "/conversations",
    icon: MessageSquare,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Knowledge Base",
    href: "/knowledge",
    icon: BookOpen,
  },
];

const bottomItems = [
  {
    label: "Team",
    href: "/settings/team",
    icon: Users,
  },
  {
    label: "API Keys",
    href: "/settings/api-keys",
    icon: Key,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen bg-card border-r border-border/60 fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border/40">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg gradient-text">Agentra</span>
      </div>

      {/* Plan badge */}
      <div className="px-4 py-3 border-b border-border/40">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20">
          <Zap className="w-3 h-3 text-violet-600" />
          <span className="text-xs font-medium text-violet-700 dark:text-violet-300">Free plan</span>
          <Link href="/settings/billing" className="ml-auto text-xs text-violet-600 hover:underline font-medium">
            Upgrade
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
              isActive(item.href)
                ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon
              className={cn(
                "w-4 h-4 flex-shrink-0",
                isActive(item.href)
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            {item.label}
            {isActive(item.href) && (
              <ChevronRight className="w-3 h-3 ml-auto text-violet-400" />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-4 border-t border-border/40 space-y-0.5">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
              isActive(item.href)
                ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-border/40">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">User Name</div>
            <div className="text-xs text-muted-foreground truncate">user@example.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
