
import { GoogleGenAI, Modality as GenModality, Type } from "@google/genai";
import { AIRole, Modality } from "../types";
import { SYSTEM_ROLE_INSTRUCTIONS } from "../constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `Deterministic industrial documentation asset: ${prompt}` }] },
    config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("IMAGE_FORGE_FAILURE");
};

export const generateVideo = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Industrial system documentation, clean, technical: ${prompt}`,
    config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '16:9' }
  });
  
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }
  
  const link = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${link}&key=${process.env.API_KEY}`;
};

export const generateAudio = async (text: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Aegis Command: ${text}` }] }],
    config: {
      responseModalities: [GenModality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
    },
  });
  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64) throw new Error("TTS_FAILURE");
  return base64;
};

export const generateFileAsset = async (prompt: string): Promise<{ filename: string; content: string; mimeType: string }> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `System Request: Generate a professional file based on: ${prompt}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          filename: { type: Type.STRING },
          content: { type: Type.STRING },
          mimeType: { type: Type.STRING }
        },
        required: ["filename", "content", "mimeType"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
