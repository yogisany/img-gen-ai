import { AspectRatioType, StylePreset } from './types';
import { Square, Smartphone, Monitor, RectangleHorizontal, RectangleVertical } from 'lucide-react';

export const ASPECT_RATIOS: { value: AspectRatioType; label: string; icon: any; description: string }[] = [
  { value: "1:1", label: "Persegi (1:1)", icon: Square, description: "Instagram Post" },
  { value: "9:16", label: "Portrait (9:16)", icon: Smartphone, description: "Stories, TikTok, Reels" },
  { value: "16:9", label: "Landscape (16:9)", icon: Monitor, description: "YouTube, Twitter" },
  { value: "3:4", label: "Portrait (3:4)", icon: RectangleVertical, description: "Instagram Portrait" },
  { value: "4:3", label: "Landscape (4:3)", icon: RectangleHorizontal, description: "Standard Photo" },
];

export const STYLE_PRESETS: StylePreset[] = [
  { id: 'none', label: 'Tanpa Gaya (Default)', promptModifier: '' },
  { id: 'photorealistic', label: 'Fotorealistik', promptModifier: 'photorealistic, 8k resolution, highly detailed, cinematic lighting, photography' },
  { id: 'anime', label: 'Anime / Manga', promptModifier: 'anime style, studio ghibli style, vibrantly colored, detailed shading' },
  { id: '3d-render', label: '3D Render', promptModifier: '3d render, unreal engine 5, octane render, ray tracing, cute, smooth textures' },
  { id: 'cyberpunk', label: 'Cyberpunk', promptModifier: 'cyberpunk style, neon lights, futuristic, high tech, dark atmosphere' },
  { id: 'oil-painting', label: 'Lukisan Minyak', promptModifier: 'oil painting, textured, classic art style, visible brushstrokes' },
  { id: 'vector', label: 'Vektor', promptModifier: 'vector art, flat design, clean lines, minimalist, illustrator' },
];

export const PLACEHOLDER_IMAGES = [
  "https://picsum.photos/400/400",
  "https://picsum.photos/400/401",
  "https://picsum.photos/400/402",
  "https://picsum.photos/400/403",
];