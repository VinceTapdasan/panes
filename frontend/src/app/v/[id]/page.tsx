"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, type PaneResponse } from "@/lib/api";
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
  Eye,
  Check,
  Copy,
  AlertCircle,
} from "lucide-react";

export default function PaneViewPage() {
  const params = useParams();
  const id = params.id as string;

  const [pane, setPane] = useState<PaneResponse | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPane() {
      try {
        setLoading(true);
        setError(null);

        // Fetch metadata and content in parallel
        const [paneData, content] = await Promise.all([
          api.getPane(id),
          api.getPaneRaw(id),
        ]);

        setPane(paneData);
        setHtmlContent(content);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("410") || err.message.includes("expired")) {
            setError("This pane has expired and is no longer available.");
          } else if (err.message.includes("404") || err.message.includes("not found")) {
            setError("Pane not found. It may have been deleted.");
          } else {
            setError(err.message);
          }
        } else {
          setError("Failed to load pane");
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPane();
    }
  }, [id]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-brand animate-spin" />
          <span className="text-sm text-muted-foreground">Loading pane...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !pane || !htmlContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-16 h-16 rounded-md bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {error?.includes("expired") ? "Pane Expired" : "Pane Not Found"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {error || "This pane could not be loaded."}
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload a new file
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
              {pane.originalName}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-muted-foreground mr-2 hidden sm:flex">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-xs">{pane.viewCount}</span>
          </div>

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
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied!" : "Copy link"}</TooltipContent>
          </Tooltip>

          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-secondary text-sm cursor-pointer h-8"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              New
            </Button>
          </Link>
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 relative m-3 sm:m-4 border border-border rounded-md overflow-hidden">
        <iframe
          sandbox="allow-scripts allow-same-origin"
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
          ID: {id}
        </span>
      </div>
    </div>
  );
}
