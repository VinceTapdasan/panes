"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { api, type PaneResponse, type UploadResponse } from "@/lib/api";
import { useAuth } from "./auth-context";

interface PanesState {
  panes: PaneResponse[];
  loading: boolean;
  error: string | null;
  fetchPanes: () => Promise<void>;
  uploadPane: (file: File) => Promise<UploadResponse>;
  deletePane: (id: string) => Promise<void>;
  clearError: () => void;
}

const PanesContext = createContext<PanesState | null>(null);

export function PanesProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const [panes, setPanes] = useState<PaneResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPanes = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.listPanes(token);
      setPanes(response.panes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch panes");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const uploadPane = useCallback(
    async (file: File): Promise<UploadResponse> => {
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.uploadPane(file, token);
        // Refresh the list after upload
        await fetchPanes();
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getToken, fetchPanes],
  );

  const deletePane = useCallback(
    async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        await api.deletePane(id, token);
        // Remove from local state
        setPanes((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Delete failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getToken],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <PanesContext.Provider
      value={{
        panes,
        loading,
        error,
        fetchPanes,
        uploadPane,
        deletePane,
        clearError,
      }}
    >
      {children}
    </PanesContext.Provider>
  );
}

export function usePanes() {
  const context = useContext(PanesContext);
  if (!context) {
    throw new Error("usePanes must be used within a PanesProvider");
  }
  return context;
}
