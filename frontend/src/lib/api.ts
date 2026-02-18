const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiOptions {
  method?: string;
  body?: FormData | string;
  token?: string;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, token, headers = {} } = options;

  const requestHeaders: Record<string, string> = { ...headers };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (body && typeof body === "string") {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(response.status, error.message || "Request failed");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Auth endpoints
export const api = {
  // GET /auth/me
  getMe: (token: string) => request<AuthUser>("/auth/me", { token }),

  // POST /panes/upload
  uploadPane: (file: File, token: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<UploadResponse>("/panes/upload", {
      method: "POST",
      body: formData,
      token,
    });
  },

  // GET /panes
  listPanes: (token: string) => request<PaneListResponse>("/panes", { token }),

  // GET /panes/:id
  getPane: (id: string) => request<PaneResponse>(`/panes/${id}`),

  // GET /panes/:id/raw (returns HTML string)
  getPaneRaw: async (id: string): Promise<string> => {
    const response = await fetch(`${API_URL}/panes/${id}/raw`);
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch pane content");
    }
    return response.text();
  },

  // DELETE /panes/:id
  deletePane: (id: string, token: string) =>
    request<void>(`/panes/${id}`, { method: "DELETE", token }),
};

// Types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  emailVerified: boolean;
  provider: string;
}

export interface UploadResponse {
  id: string;
  shareUrl: string;
  expiresAt: string;
}

export interface PaneResponse {
  id: string;
  originalName: string;
  sizeBytes: number;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
  isPublic: boolean;
  shareUrl: string;
}

export interface PaneListResponse {
  panes: PaneResponse[];
  total: number;
}

export { ApiError };
