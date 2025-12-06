import React, { useState, useEffect } from 'react';
import { TattooGenerator } from './components/TattooGenerator';
import { MockupStudio } from './components/MockupStudio';
import { AppView, GeneratedImage } from './types';
import { checkApiKeySelection, promptForApiKey } from './services/geminiService';
import { PenTool, Layers, LayoutGrid, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('generate');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    const verifyKey = async () => {
      try {
        const hasKey = await checkApiKeySelection();
        setHasApiKey(hasKey);
      } catch (e) {
        console.error("Error checking API key:", e);
      } finally {
        setIsCheckingKey(false);
      }
    };
    verifyKey();
  }, []);

  const handleConnectKey = async () => {
    try {
      await promptForApiKey();
      // Assume success after dialog interaction, but let's re-verify briefly or just optimistic update
      // The guidance says: "Assume the key selection was successful... Do not add delay"
      setHasApiKey(true); 
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  const handleNewDesign = (image: GeneratedImage) => {
    setGeneratedImages(prev => [image, ...prev]);
    setSelectedDesign(image);
  };

  if (isCheckingKey) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-ink-900 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-ink-800 p-8 rounded-2xl border border-ink-700 shadow-2xl">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-serif text-white mb-4">Access Required</h1>
          <p className="text-ink-100 mb-6">
            To generate high-quality 4K tattoo designs and realistic mockups, InkSpire uses the advanced 
            <span className="font-mono text-accent mx-1">gemini-3-pro-image-preview</span> model.
          </p>
          <p className="text-ink-500 text-sm mb-8">
            This model requires a paid API key from a Google Cloud Project. 
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-accent hover:underline ml-1">
              Learn more about billing.
            </a>
          </p>
          <button
            onClick={handleConnectKey}
            className="w-full py-3 px-6 bg-accent hover:bg-accent-hover text-white rounded-lg font-semibold transition-all shadow-lg shadow-accent/20"
          >
            Connect API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900 text-ink-100 font-sans selection:bg-accent selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-ink-800 bg-ink-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center text-white font-serif font-bold">
              I
            </div>
            <span className="text-xl font-serif font-bold text-white tracking-tight">InkSpire</span>
          </div>

          <div className="flex items-center gap-1 bg-ink-800 p-1 rounded-lg border border-ink-700">
            <button
              onClick={() => setView('generate')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                view === 'generate' ? 'bg-ink-700 text-white shadow-sm' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <PenTool className="w-4 h-4" /> Design
            </button>
            <button
              onClick={() => setView('mockup')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                view === 'mockup' ? 'bg-ink-700 text-white shadow-sm' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <Layers className="w-4 h-4" /> Try On
            </button>
             <button
              onClick={() => setView('gallery')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                view === 'gallery' ? 'bg-ink-700 text-white shadow-sm' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Gallery
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {view === 'generate' && (
          <div className="space-y-8 animate-fade-in">
             <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl font-serif text-white mb-4">Design Your Next Ink</h1>
                <p className="text-ink-400 text-lg">
                  Use advanced AI to generate unique tattoo concepts in up to 4K resolution.
                </p>
             </div>
             <TattooGenerator onGenerate={handleNewDesign} />
          </div>
        )}

        {view === 'mockup' && (
          <div className="space-y-8 animate-fade-in">
             <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl font-serif text-white mb-4">Virtual Try-On</h1>
                <p className="text-ink-400 text-lg">
                  See how your design looks on skin before you commit.
                </p>
             </div>
            <MockupStudio selectedDesign={selectedDesign} />
          </div>
        )}

        {view === 'gallery' && (
          <div className="animate-fade-in">
             <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl font-serif text-white mb-4">Your Portfolio</h1>
             </div>
            {generatedImages.length === 0 ? (
              <div className="text-center py-20 bg-ink-800 rounded-2xl border border-ink-700">
                <p className="text-ink-500">No designs generated yet.</p>
                <button 
                  onClick={() => setView('generate')}
                  className="mt-4 text-accent hover:underline"
                >
                  Start Creating
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((img) => (
                  <div key={img.id} className="group relative bg-black rounded-xl overflow-hidden border border-ink-700 aspect-square">
                    <img src={img.url} alt={img.prompt} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-white text-sm line-clamp-2 mb-3">{img.prompt}</p>
                      <div className="flex gap-2">
                         <button 
                            onClick={() => {
                                setSelectedDesign(img);
                                setView('mockup');
                            }}
                            className="flex-1 bg-accent text-white text-xs py-2 rounded font-medium hover:bg-accent-hover transition-colors"
                         >
                            Try On
                         </button>
                         <a 
                            href={img.url}
                            download={`tattoo-${img.id}.png`}
                            className="bg-white/10 text-white p-2 rounded hover:bg-white/20 transition-colors"
                         >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                         </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;