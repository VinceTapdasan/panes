"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFile } from "@/context/file-context";
import { Badge } from "@/components/ui/badge";
import {
  FileCode,
  Upload,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { setFile } = useFile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".html")) {
        setError("Only .html files are accepted");
        return;
      }

      setError(null);
      setIsLoading(true);

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
    },
    [setFile, router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
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
    [processFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-semibold text-foreground">
          Home
        </h1>
      </div>

      {/* Upload zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-md transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-brand bg-brand/5"
            : "border-border hover:border-muted-foreground/30",
          isLoading && "pointer-events-none opacity-60"
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
                Reading file...
              </span>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "w-14 h-14 rounded-md flex items-center justify-center transition-colors",
                  isDragging ? "bg-brand/20" : "bg-secondary"
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
                  {isDragging
                    ? "Release to upload"
                    : "Drag & drop your HTML file here"}
                </p>
                <p className="text-xs text-muted-foreground font-normal mt-1.5">
                  or click anywhere to browse
                </p>
              </div>

              <Badge
                variant="secondary"
                className="text-[11px] font-normal"
              >
                .html files only
              </Badge>
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
        accept=".html"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
