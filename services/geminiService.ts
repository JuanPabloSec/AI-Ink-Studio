import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

// Helper to get a fresh AI instance with the currently selected key
const getAIClient = () => {
  // We assume the key is injected into process.env.API_KEY by the environment
  // after the user selects it via window.aistudio.openSelectKey()
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const checkApiKeySelection = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  // Fallback for dev environments without the specific window object
  return !!process.env.API_KEY;
};

export const promptForApiKey = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    console.warn("AI Studio key selection not available in this environment.");
  }
};

export const generateTattooDesign = async (
  prompt: string,
  config: { aspectRatio: AspectRatio; imageSize: ImageSize }
): Promise<string> => {
  const ai = getAIClient();
  
  // Enhanced prompt for tattoo specifics
  const fullPrompt = `Professional tattoo design, high quality, sharp lines, white background. ${prompt}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: fullPrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: config.aspectRatio,
        imageSize: config.imageSize,
      },
    },
  });

  // Extract image
  let imageUrl = '';
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64String = part.inlineData.data;
        imageUrl = `data:image/png;base64,${base64String}`;
        break;
      }
    }
  }

  if (!imageUrl) {
    throw new Error("No image generated.");
  }

  return imageUrl;
};

export const generateMockup = async (
  bodyImageBase64: string,
  tattooImageBase64: string | null,
  prompt: string
): Promise<string> => {
  const ai = getAIClient();
  
  const parts: any[] = [];

  // Add body image (Base)
  parts.push({
    inlineData: {
      data: bodyImageBase64.split(',')[1], // Remove data url prefix
      mimeType: 'image/png', // Assuming PNG or standard image
    }
  });

  // Add tattoo image (Reference) if available
  if (tattooImageBase64) {
    parts.push({
      inlineData: {
        data: tattooImageBase64.split(',')[1],
        mimeType: 'image/png',
      }
    });
  }

  // Add instruction
  let finalPrompt = `Edit the first image (body part) to realistically show a tattoo. `;
  if (tattooImageBase64) {
    finalPrompt += `Use the design in the second image as the tattoo reference. Superimpose it on the skin realistically, respecting skin texture and lighting. `;
  }
  finalPrompt += `Instruction: ${prompt}`;

  parts.push({ text: finalPrompt });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: parts,
    },
    config: {
      imageConfig: {
        aspectRatio: '1:1', // Usually output matches input aspect for edits, but we must set something valid.
        imageSize: '1K', // Default for mockup
      },
    },
  });

   // Extract image
   let imageUrl = '';
   if (response.candidates && response.candidates[0].content.parts) {
     for (const part of response.candidates[0].content.parts) {
       if (part.inlineData) {
         const base64String = part.inlineData.data;
         imageUrl = `data:image/png;base64,${base64String}`;
         break;
       }
     }
   }
 
   if (!imageUrl) {
     throw new Error("No mockup generated.");
   }
 
   return imageUrl;
};