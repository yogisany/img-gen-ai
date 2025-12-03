import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ImageGrid from './components/ImageGrid';
import { GenerationSettings } from './types';
import { generateImageBatch } from './services/geminiService';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  const [settings, setSettings] = useState<GenerationSettings>({
    prompt: '',
    negativePrompt: '',
    aspectRatio: '1:1',
    style: '',
  });

  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        }
      } catch (e) {
        console.error("Error checking API key", e);
      } finally {
        setIsCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success after dialog interaction to avoid race conditions
      setHasApiKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!settings.prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]); // Clear previous images while loading

    try {
      const images = await generateImageBatch(settings);
      setGeneratedImages(images);
    } catch (err: any) {
      console.error(err);
      
      // If the error suggests auth issues, we might want to prompt for key again,
      // but usually the service throws a specific error. 
      // For now, just show the message.
      if (err.message && (err.message.includes("API key") || err.message.includes("403"))) {
         setError("Masalah dengan API Key. Silakan refresh atau periksa billing GCP Anda.");
      } else {
         setError(err.message || "Terjadi kesalahan saat membuat gambar.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingKey) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mb-6 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">Imajinasi AI</h1>
          <p className="text-slate-400 mb-8">
            Generasikan gambar berkualitas tinggi secara konsisten menggunakan model Gemini terbaru. Hubungkan API Key Anda untuk memulai.
          </p>

          <button 
            onClick={handleConnectKey}
            className="w-full bg-white text-slate-900 font-bold py-3.5 px-6 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 group"
          >
            Hubungkan API Key
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>API Key diproses dengan aman oleh Google AI Studio</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">
               Informasi Billing & API Key
             </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar
        settings={settings}
        setSettings={setSettings}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        error={error}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
            <header className="p-4 lg:px-8 lg:py-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur flex justify-between items-center lg:hidden">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Imajinasi AI
                </span>
            </header>
            
            <ImageGrid 
              images={generatedImages} 
              isGenerating={isLoading} 
              aspectRatio={settings.aspectRatio} 
            />
        </div>
      </main>
    </div>
  );
};

export default App;