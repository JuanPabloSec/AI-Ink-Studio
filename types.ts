export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  createdAt: number;
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface GenerationConfig {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
}

export type AppView = 'generate' | 'mockup' | 'gallery';

// Extended Window interface for AI Studio helpers
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
