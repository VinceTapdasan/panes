"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFile } from "@/context/file-context";
import { useAuth } from "@/context/auth-context";
import { usePanes } from "@/context/panes-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileCode,
  Upload,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { setFile } = useFile();
  const { user, signInWithGoogle } = useAuth();
  const { uploadPane } = usePanes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    id: string;
    shareUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".html") && !file.name.toLowerCase().endsWith(".htm")) {
        setError("Only .html files are accepted");
        return;
      }

      setError(null);
      setIsLoading(true);
      setUploadResult(null);

      try {
        // If user is authenticated, upload to backend
        if (user) {
          const result = await uploadPane(file);
          setUploadResult({ id: result.id, shareUrl: result.shareUrl });
          setIsLoading(false);
        } else {
          // Local-only preview (not authenticated)
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            setFile(content, file.name);
            router.push("/view");
          };
          reader.onerror = () => {
            setError("Failed to read file");
            setIsLoading(false);
          };
          reader.readAsText(file);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setIsLoading(false);
      }
    },
    [user, uploadPane, setFile, router],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleClick = () => {
    if (!uploadResult) {
      fileInputRef.current?.click();
    }
  };

  const handleCopy = async () => {
    if (uploadResult?.shareUrl) {
      await navigator.clipboard.writeText(uploadResult.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setUploadResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-semibold text-foreground">Home</h1>
      </div>

      {/* Upload zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-md transition-all duration-200",
          uploadResult
            ? "border-brand bg-brand/5"
            : isDragging
              ? "border-brand bg-brand/5 cursor-pointer"
              : "border-border hover:border-muted-foreground/30 cursor-pointer",
          isLoading && "pointer-events-none opacity-60",
        )}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="py-16 sm:py-20 flex flex-col items-center gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-brand animate-spin" />
              <span className="text-sm text-muted-foreground font-normal">
                {user ? "Uploading..." : "Reading file..."}
              </span>
            </div>
          ) : uploadResult ? (
            <div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
              <div className="w-14 h-14 rounded-md flex items-center justify-center bg-brand/20">
                <LinkIcon className="w-6 h-6 text-brand" />
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Upload complete!</p>
                <p className="text-xs text-muted-foreground font-normal mt-1.5">
                  Your HTML file is ready to share
                </p>
              </div>

              {/* Share URL */}
              <div className="w-full flex items-center gap-2 p-3 rounded-md bg-secondary/50 border border-border">
                <input
                  type="text"
                  value={uploadResult.shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-foreground outline-none"
                />
                <Button variant="ghost" size="sm" onClick={handleCopy} className="shrink-0">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Upload another
                </Button>
                <Button size="sm" onClick={() => window.open(uploadResult.shareUrl, "_blank")}>
                  Open preview
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "w-14 h-14 rounded-md flex items-center justify-center transition-colors",
                  isDragging ? "bg-brand/20" : "bg-secondary",
                )}
              >
                {isDragging ? (
                  <FileCode className="w-6 h-6 text-brand" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {isDragging ? "Release to upload" : "Drag & drop your HTML file here"}
                </p>
                <p className="text-xs text-muted-foreground font-normal mt-1.5">
                  or click anywhere to browse
                </p>
              </div>

              <Badge variant="secondary" className="text-[11px] font-normal">
                .html files only
              </Badge>

              {/* Sign in prompt for guests */}
              {!user && (
                <div className="flex flex-col items-center gap-2 pt-4 border-t border-border mt-2">
                  <p className="text-xs text-muted-foreground">Sign in to get shareable links</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      signInWithGoogle();
                    }}
                  >
                    Sign in with Google
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-normal">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
