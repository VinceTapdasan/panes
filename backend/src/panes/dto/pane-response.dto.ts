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

export interface UploadResponse {
  id: string;
  shareUrl: string;
  expiresAt: string;
}

export interface PaneListResponse {
  panes: PaneResponse[];
  total: number;
}
