"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, Upload } from "lucide-react";

export default function FilesPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-semibold text-foreground">
          Files
        </h1>
        <p className="text-sm text-muted-foreground font-normal mt-1">
          0 files uploaded
        </p>
      </div>

      {/* Empty state */}
      <Card className="bg-card border-border">
        <CardContent className="py-20 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center">
            <FileCode className="w-7 h-7 text-muted-foreground/30" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              No files yet
            </p>
            <p className="text-xs text-muted-foreground font-normal mt-1.5 max-w-[240px]">
              Upload an HTML file from the dashboard to see it here
            </p>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-secondary text-sm cursor-pointer mt-2"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Go to dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
