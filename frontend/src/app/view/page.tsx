"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFile } from "@/context/file-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Code2,
  LayoutDashboard,
  Upload,
  Link2,
  Loader2,
  Monitor,
} from "lucide-react";

export default function ViewPage() {
  const router = useRouter();
  const { htmlContent, fileName, clearFile } = useFile();
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (!htmlContent) {
      router.replace("/");
    }
  }, [htmlContent, router]);

  if (!htmlContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 text-brand animate-spin" />
      </div>
    );
  }

  const handleUploadNew = () => {
    clearFile();
    router.push("/");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border shrink-0 bg-background/80 backdrop-blur-xl">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-brand-foreground" />
            </div>
          </Link>

          <div className="w-px h-4 bg-border shrink-0 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <Badge
              variant="secondary"
              className="text-[11px] font-normal shrink-0 hidden sm:inline-flex"
            >
              Viewing
            </Badge>
            <span className="text-sm text-foreground truncate">
              {fileName}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer hidden sm:flex"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Dashboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground/30 cursor-not-allowed"
                disabled
                onMouseEnter={() => setShowCopied(true)}
                onMouseLeave={() => setShowCopied(false)}
              >
                <Link2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sharing requires backend</TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadNew}
            className="border-border text-foreground hover:bg-secondary text-sm cursor-pointer h-8"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            New
          </Button>
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 relative m-3 sm:m-4 border border-border rounded-md overflow-hidden">
        <iframe
          sandbox="allow-scripts"
          srcDoc={htmlContent}
          className="absolute inset-0 w-full h-full border-0 bg-white"
          title="HTML Preview"
        />
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2 border-t border-border shrink-0">
        <div className="flex items-center gap-1.5">
          <Monitor className="w-3 h-3 text-muted-foreground/40" />
          <span className="text-[11px] text-muted-foreground/40 font-normal">
            Preview
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground/40 font-normal">
          Client-side render
        </span>
      </div>
    </div>
  );
}
