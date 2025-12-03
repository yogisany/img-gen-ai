import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ImageGrid from './components/ImageGrid';
import { GenerationSettings } from './types';
import { generateImageBatch } from './services/geminiService';
import { Sparkles, AlertTriangle, Key } from 'lucide-react';

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
    // Check if API Key is present in the environment variables (injected via Netlify/Shim)
    const checkKey = () => {
      const apiKey = process.env.API_KEY;
      // Check if key exists and is not the placeholder or empty
      if (apiKey && apiKey !== '__API_KEY__' && apiKey.trim() !== '') {
        setHasApiKey(true);
      } else {
        setHasApiKey(false);
      }
      setIsCheckingKey(false);
    };
    checkKey();
  }, []);

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
      
      if (err.message && (err.message.includes("API key") || err.message.includes("403"))) {
         setError("Masalah dengan API Key. Silakan periksa konfigurasi environment variable Anda.");
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl mb-6 shadow-lg shadow-orange-500/20">
            <Key className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">API Key Diperlukan</h1>
          <p className="text-slate-400 mb-6">
            Aplikasi ini memerlukan Google Gemini API Key yang dikonfigurasi melalui Environment Variables.
          </p>

          <div className="bg-slate-800 rounded-lg p-4 text-left border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Instruksi Netlify:
            </h3>
            <ol className="list-decimal list-inside text-xs text-slate-400 space-y-2">
              <li>Buka Dashboard Netlify untuk situs ini.</li>
              <li>Masuk ke <strong>Site configuration &gt; Environment variables</strong>.</li>
              <li>Tambahkan variable baru dengan Key: <code className="text-indigo-400">API_KEY</code>.</li>
              <li>Isi Value dengan Gemini API Key Anda.</li>
              <li>Simpan dan lakukan <strong>Redeploy</strong> (Trigger deploy).</li>
            </ol>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">
               Dapatkan API Key di Google AI Studio
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