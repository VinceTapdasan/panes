"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileCode, Eye, TrendingUp, HardDrive, Inbox } from "lucide-react";

const STATS = [
  { label: "Total files", value: "0", icon: FileCode },
  { label: "Total views", value: "0", icon: Eye },
  { label: "This week", value: "0", icon: TrendingUp },
  { label: "Storage", value: "0 KB", icon: HardDrive },
];

export default function RightPanel() {
  return (
    <aside className="hidden xl:flex w-[350px] shrink-0 border-l border-border h-screen sticky top-0 flex-col p-4 gap-4 overflow-y-auto">
      {/* Stats */}
      <Card className="bg-card border-border">
        <CardContent className="pt-4 pb-3">
          <p className="text-[13px] font-semibold text-foreground mb-3">Overview</p>
          <div className="space-y-3">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-muted-foreground/50" />
                    <span className="text-[13px] text-muted-foreground font-normal">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-foreground tabular-nums">
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent uploads */}
      <Card className="bg-card border-border">
        <CardContent className="pt-4 pb-3">
          <p className="text-[13px] font-semibold text-foreground mb-3">Recent uploads</p>
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center">
              <Inbox className="w-4 h-4 text-muted-foreground/40" />
            </div>
            <p className="text-[13px] text-muted-foreground font-normal">No uploads yet</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-[11px] text-muted-foreground/40 font-normal px-1">
        v0.1 -- Client-side only
      </p>
    </aside>
  );
}
