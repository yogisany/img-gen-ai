export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  style: string;
}

export type AspectRatioType = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface GenerationSettings {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: AspectRatioType;
  style: string;
  seed?: number;
}

export interface StylePreset {
  id: string;
  label: string;
  promptModifier: string;
}