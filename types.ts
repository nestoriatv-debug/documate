export type ToolId =
  | 'image-to-pdf'
  | 'pdf-merge'
  | 'pdf-split'
  | 'pdf-compress'
  | 'image-compress'
  | 'image-resize'
  | 'format-converter'
  | 'passport-photo'
  | 'document-scanner';

export type TabId = 'home' | 'files' | 'settings';
export type ScreenType = TabId;

export interface RecentFile {
  id: string;
  name: string;
  type: 'pdf' | 'jpg' | 'png';
  sizeBytes: number;
  createdAt: number;
  thumbnailUrl?: string; // base64 preview
  blob?: Blob;
  category: ToolId | 'scanner' | 'manual';
  pageCount?: number;
}

export interface AdConfig {
  appId: string;
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
  isEnabled: boolean;
  showTestAds: boolean;
}

export interface PassportPreset {
  id: string;
  name: string;
  description: string;
  widthMm: number;
  heightMm: number;
  aspectRatio: number; // width / height
  recommendedPx: { width: number; height: number };
}

export interface ResizePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'social' | 'document' | 'custom';
}

export type ScannerFilter = 'original' | 'magic' | 'bw' | 'grayscale';
