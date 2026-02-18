"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Files, Code2, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Files", href: "/files", icon: Files },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-brand-foreground" />
          </div>
          <span className="text-sm text-foreground font-semibold">
            Panes
          </span>
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground cursor-pointer"
            >
              {open ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] bg-sidebar border-border p-0 flex flex-col"
          >
            {/* Brand */}
            <div className="px-6 py-6 border-b border-border">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-brand-foreground" />
                </div>
                <span className="text-sm text-foreground font-semibold">
                  Panes
                </span>
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1">
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
                    onClick={() => setOpen(false)}
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
            <div className="px-3 pb-4 border-t border-border pt-3">
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
                <TooltipContent side="right">
                  Requires backend
                </TooltipContent>
              </Tooltip>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
