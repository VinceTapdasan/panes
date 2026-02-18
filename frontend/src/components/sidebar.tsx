"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Files, Code2, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Files", href: "/files", icon: Files },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <aside className="hidden lg:flex w-[272px] shrink-0 border-r border-border h-screen sticky top-0 flex-col">
      {/* Brand */}
      <div className="px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center">
            <Code2 className="w-4 h-4 text-brand-foreground" />
          </div>
          <span className="text-sm text-foreground font-semibold">Panes</span>
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

      {/* User section */}
      <div className="px-3 pb-6 space-y-3">
        {/* User info */}
        {user && (
          <div className="flex items-center gap-3 px-4 py-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback className="bg-secondary text-xs">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.displayName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Auth button */}
        {loading ? (
          <Button
            variant="ghost"
            disabled
            className="w-full justify-start gap-3 px-4 py-3 h-auto text-muted-foreground/40 font-medium text-sm"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Loading...
          </Button>
        ) : user ? (
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start gap-3 px-4 py-3 h-auto text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium text-sm"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign out
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={signInWithGoogle}
            className="w-full justify-start gap-3 px-4 py-3 h-auto text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium text-sm"
          >
            <LogIn className="w-[18px] h-[18px]" />
            Sign in
          </Button>
        )}
      </div>
    </aside>
  );
}
