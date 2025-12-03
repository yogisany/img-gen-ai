import { GoogleGenAI } from "@google/genai";
import { GenerationSettings } from "../types";

/**
 * Generates a single image based on the provided settings.
 * We will call this multiple times in parallel to simulate a batch of 4.
 */
const generateSingleImage = async (
  settings: GenerationSettings, 
  index: number
): Promise<string | null> => {
  try {
    // Initialize inside the function to ensure we use the latest API Key selected by the user
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let fullPrompt = settings.style 
      ? `${settings.prompt}, ${settings.style}` 
      : settings.prompt;

    // Add negative prompt if present
    if (settings.negativePrompt && settings.negativePrompt.trim()) {
      fullPrompt += `. Do not include: ${settings.negativePrompt}`;
    }

    // We can use the seed to introduce slight variations if needed.
    // If a seed is provided by user, we use it + index to ensure they aren't identical duplicates
    // while maintaining deterministic behavior for that batch.
    const seed = settings.seed ? settings.seed + index : undefined;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // High quality model
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: settings.aspectRatio,
          imageSize: "1K", 
        },
        // Only set seed if explicitly provided/calculated
        ...(seed !== undefined ? { seed: seed } : {}),
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error generating image ${index + 1}:`, error);
    return null;
  }
};

/**
 * Orchestrates the generation of 4 images in parallel.
 */
export const generateImageBatch = async (
  settings: GenerationSettings
): Promise<string[]> => {
  // Create an array of 4 promises
  const promises = Array.from({ length: 4 }).map((_, index) => 
    generateSingleImage(settings, index)
  );

  // Wait for all to finish (settled), so if one fails, we still get the others
  const results = await Promise.allSettled(promises);

  // Filter out successful strings
  const images: string[] = [];
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      images.push(result.value);
    }
  });

  if (images.length === 0) {
    throw new Error("Gagal menghasilkan gambar. Silakan coba lagi dengan prompt yang berbeda atau periksa koneksi API Key Anda.");
  }

  return images;
};