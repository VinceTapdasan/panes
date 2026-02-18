"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface FileState {
  htmlContent: string | null;
  fileName: string | null;
  setFile: (content: string, name: string) => void;
  clearFile: () => void;
}

const FileContext = createContext<FileState | null>(null);

export function FileProvider({ children }: { children: ReactNode }) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const setFile = (content: string, name: string) => {
    setHtmlContent(content);
    setFileName(name);
  };

  const clearFile = () => {
    setHtmlContent(null);
    setFileName(null);
  };

  return (
    <FileContext.Provider value={{ htmlContent, fileName, setFile, clearFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFile() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
}
