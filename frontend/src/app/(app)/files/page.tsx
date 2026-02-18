"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileCode,
  Upload,
  Loader2,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  Eye,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { usePanes } from "@/context/panes-context";
import { cn } from "@/lib/utils";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeRemaining(expiresAt: string): string {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h left`;

  const days = Math.floor(hours / 24);
  return `${days}d left`;
}

export default function FilesPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { panes, loading, error, fetchPanes, deletePane } = usePanes();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPanes();
    }
  }, [user, fetchPanes]);

  const handleCopy = async (shareUrl: string, id: string) => {
    await navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pane? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      await deletePane(id);
    } finally {
      setDeletingId(null);
    }
  };

  // Not authenticated
  if (!authLoading && !user) {
    return (
      <div className="space-y-4">
        <div className="border-b border-border pb-4">
          <h1 className="text-xl font-semibold text-foreground">Files</h1>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="py-20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center">
              <LogIn className="w-7 h-7 text-muted-foreground/30" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Sign in to view your files</p>
              <p className="text-xs text-muted-foreground font-normal mt-1.5 max-w-[240px]">
                Your uploaded HTML files will appear here
              </p>
            </div>
            <Button variant="outline" className="mt-2" onClick={signInWithGoogle}>
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading
  if (authLoading || loading) {
    return (
      <div className="space-y-4">
        <div className="border-b border-border pb-4">
          <h1 className="text-xl font-semibold text-foreground">Files</h1>
        </div>

        <div className="py-20 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
          <span className="text-sm text-muted-foreground">Loading files...</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (panes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="border-b border-border pb-4">
          <h1 className="text-xl font-semibold text-foreground">Files</h1>
          <p className="text-sm text-muted-foreground font-normal mt-1">0 files uploaded</p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="py-20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center">
              <FileCode className="w-7 h-7 text-muted-foreground/30" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">No files yet</p>
              <p className="text-xs text-muted-foreground font-normal mt-1.5 max-w-[240px]">
                Upload an HTML file from the dashboard to see it here
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="mt-2">
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Go to dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Files list
  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-semibold text-foreground">Files</h1>
        <p className="text-sm text-muted-foreground font-normal mt-1">
          {panes.length} file{panes.length !== 1 ? "s" : ""} uploaded
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[15%]">Size</TableHead>
              <TableHead className="w-[15%]">Views</TableHead>
              <TableHead className="w-[15%]">Expires</TableHead>
              <TableHead className="w-[15%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {panes.map((pane) => (
              <TableRow key={pane.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate max-w-[200px]">{pane.originalName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatBytes(pane.sizeBytes)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye className="w-3.5 h-3.5" />
                    {pane.viewCount}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px]",
                      getTimeRemaining(pane.expiresAt) === "Expired" &&
                        "bg-destructive/10 text-destructive",
                    )}
                  >
                    {getTimeRemaining(pane.expiresAt)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleCopy(pane.shareUrl, pane.id)}
                    >
                      {copiedId === pane.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                      <a href={pane.shareUrl} target="_blank" rel="noopener">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(pane.id)}
                      disabled={deletingId === pane.id}
                    >
                      {deletingId === pane.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
