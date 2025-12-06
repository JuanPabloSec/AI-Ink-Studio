import React, { useState } from 'react';
import { AspectRatio, ImageSize, GeneratedImage } from '../types';
import { Button } from './Button';
import { generateTattooDesign } from '../services/geminiService';
import { Wand2, Download, Copy, RefreshCw } from 'lucide-react';

interface TattooGeneratorProps {
  onGenerate: (image: GeneratedImage) => void;
}

export const TattooGenerator: React.FC<TattooGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GeneratedImage | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateTattooDesign(prompt, { aspectRatio, imageSize });
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt,
        aspectRatio,
        createdAt: Date.now()
      };
      setPreview(newImage);
      onGenerate(newImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate design");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto">
      {/* Controls */}
      <div className="flex-1 bg-ink-800 p-8 rounded-2xl border border-ink-700 shadow-2xl">
        <h2 className="text-3xl font-serif text-white mb-6 flex items-center gap-3">
          <Wand2 className="text-accent" /> Create Design
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-ink-100 font-medium mb-2">Tattoo Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. A geometric wolf head with watercolor splashes, minimalist style..."
              className="w-full h-32 bg-ink-900 border border-ink-600 rounded-lg p-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-ink-100 font-medium mb-2">Aspect Ratio</label>
              <div className="relative">
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="w-full bg-ink-900 border border-ink-600 rounded-lg p-3 text-white appearance-none focus:border-accent outline-none"
                >
                  <option value="1:1">1:1 (Square)</option>
                  <option value="3:4">3:4 (Portrait)</option>
                  <option value="4:3">4:3 (Landscape)</option>
                  <option value="9:16">9:16 (Tall)</option>
                  <option value="16:9">16:9 (Wide)</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-ink-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-ink-100 font-medium mb-2">Resolution</label>
               <div className="relative">
                <select
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value as ImageSize)}
                  className="w-full bg-ink-900 border border-ink-600 rounded-lg p-3 text-white appearance-none focus:border-accent outline-none"
                >
                  <option value="1K">1K</option>
                  <option value="2K">2K</option>
                  <option value="4K">4K</option>
                </select>
                 <div className="absolute right-3 top-3.5 pointer-events-none text-ink-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={handleGenerate} isLoading={isLoading} className="w-full">
            Generate Design
          </Button>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-ink-800 rounded-2xl border border-ink-700 p-4">
        {preview ? (
          <div className="w-full space-y-4 animate-fade-in">
            <div className="relative group rounded-xl overflow-hidden shadow-2xl bg-black">
              <img src={preview.url} alt="Generated Tattoo" className="w-full h-auto object-contain max-h-[600px]" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a 
                  href={preview.url} 
                  download={`tattoo-${preview.id}.png`}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                  title="Download"
                >
                  <Download className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div className="text-center text-ink-500 text-sm">
              Generated at {preview.imageSize} • {preview.aspectRatio}
            </div>
          </div>
        ) : (
          <div className="text-center text-ink-500">
            <div className="w-20 h-20 border-2 border-dashed border-ink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Wand2 className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium">Ready to create</p>
            <p className="text-sm">Enter a prompt to generate your unique design</p>
          </div>
        )}
      </div>
    </div>
  );
};