"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Files, Code2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Files", href: "/files", icon: Files },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[272px] shrink-0 border-r border-border h-screen sticky top-0 flex-col">
      {/* Brand */}
      <div className="px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center">
            <Code2 className="w-4 h-4 text-brand-foreground" />
          </div>
          <span className="text-sm text-foreground font-semibold">
            Panes
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Log out */}
      <div className="px-3 pb-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              disabled
              className="w-full justify-start gap-3 px-4 py-3 h-auto text-muted-foreground/40 cursor-not-allowed font-medium text-sm"
            >
              <LogOut className="w-[18px] h-[18px]" />
              Log out
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Requires backend</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
