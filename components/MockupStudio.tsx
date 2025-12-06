import React, { useState, useRef } from 'react';
import { GeneratedImage } from '../types';
import { Button } from './Button';
import { generateMockup } from '../services/geminiService';
import { Camera, Upload, Layers, X } from 'lucide-react';

interface MockupStudioProps {
  selectedDesign: GeneratedImage | null;
}

export const MockupStudio: React.FC<MockupStudioProps> = ({ selectedDesign }) => {
  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (end) => {
        setBodyImage(end.target?.result as string);
        setResultImage(null); // Reset result when new body image loaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateMockup = async () => {
    if (!bodyImage) return;
    
    setIsLoading(true);
    setError(null);
    try {
        // Use default instruction if empty
        const prompt = instruction.trim() || "Place the tattoo on the visible body part.";
        const url = await generateMockup(bodyImage, selectedDesign?.url || null, prompt);
        setResultImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate mockup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-ink-800 p-8 rounded-2xl border border-ink-700 shadow-2xl">
        <h2 className="text-3xl font-serif text-white mb-2 flex items-center gap-3">
          <Layers className="text-accent" /> Virtual Try-On
        </h2>
        <p className="text-ink-500 mb-8">Upload a photo of a body part and see how the tattoo fits.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
                
                {/* 1. Body Image Upload */}
                <div 
                    className={`relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer overflow-hidden ${bodyImage ? 'border-accent/50 bg-black' : 'border-ink-600 hover:border-ink-500 bg-ink-900'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {bodyImage ? (
                        <>
                            <img src={bodyImage} alt="Body" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-black/50 px-3 py-1 rounded-full text-sm text-white backdrop-blur-sm">Click to change</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-4">
                            <Camera className="w-10 h-10 text-ink-400 mx-auto mb-2" />
                            <p className="text-ink-100 font-medium">Upload Body Photo</p>
                            <p className="text-ink-500 text-sm mt-1">Arms, legs, back, etc.</p>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                    />
                </div>

                {/* 2. Selected Tattoo Design Display */}
                <div className="bg-ink-900 p-4 rounded-xl border border-ink-700 flex items-center gap-4">
                    <div className="w-16 h-16 bg-black rounded-lg border border-ink-600 flex-shrink-0 overflow-hidden">
                        {selectedDesign ? (
                            <img src={selectedDesign.url} alt="Selected Tattoo" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink-600 text-xs text-center p-1">No Design</div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">Active Tattoo Design</h4>
                        <p className="text-ink-500 text-xs mt-1">
                            {selectedDesign ? "Ready to apply" : "Select a design from the generator first (optional)"}
                        </p>
                    </div>
                </div>

                {/* 3. Instructions */}
                <div>
                     <label className="block text-ink-100 font-medium mb-2">Placement Instructions</label>
                     <textarea
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="E.g. Place the tattoo on the inner forearm, making it look slightly faded and realistic..."
                        className="w-full h-24 bg-ink-900 border border-ink-600 rounded-lg p-3 text-white text-sm focus:border-accent outline-none resize-none"
                     />
                </div>

                <Button onClick={handleGenerateMockup} disabled={!bodyImage} isLoading={isLoading} className="w-full">
                    Try On Tattoo
                </Button>
                 {error && (
                    <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
                    {error}
                    </div>
                )}
            </div>

            {/* Result Section */}
            <div className="flex flex-col h-full min-h-[400px]">
                <div className="flex-1 bg-black rounded-xl border border-ink-700 overflow-hidden flex items-center justify-center relative">
                    {resultImage ? (
                        <img src={resultImage} alt="Mockup Result" className="w-full h-full object-contain" />
                    ) : (
                         <div className="text-center text-ink-600">
                             <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
                             <p>Result will appear here</p>
                         </div>
                    )}
                </div>
                 {resultImage && (
                    <div className="mt-4 flex justify-end">
                        <a 
                            href={resultImage} 
                            download="tattoo-mockup.png"
                            className="text-accent hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Upload className="w-4 h-4" /> Download Mockup
                        </a>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};