import React from 'react';
import { AspectRatioType, GenerationSettings, StylePreset } from '../types';
import { ASPECT_RATIOS, STYLE_PRESETS } from '../constants';
import { Wand2, Loader2, Sparkles, AlertCircle, Info } from 'lucide-react';

interface SidebarProps {
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  settings,
  setSettings,
  onGenerate,
  isLoading,
  error,
}) => {
  const handleChange = (field: keyof GenerationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStyle = STYLE_PRESETS.find(s => s.id === e.target.value);
    handleChange('style', selectedStyle ? selectedStyle.promptModifier : '');
  };

  const currentStyleId = STYLE_PRESETS.find(s => s.promptModifier === settings.style)?.id || 'none';

  return (
    <aside className="w-full lg:w-96 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-700 h-auto lg:h-screen flex flex-col p-6 overflow-y-auto shrink-0 z-20">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Imajinasi AI
        </h1>
      </div>

      <div className="space-y-6 flex-1">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Deskripsi Gambar (Prompt)</label>
          <textarea
            className="w-full h-24 bg-slate-800 border border-slate-600 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all text-sm"
            placeholder="Contoh: Seorang astronot menunggang kuda di planet mars, gaya cyberpunk, pencahayaan dramatis..."
            value={settings.prompt}
            onChange={(e) => handleChange('prompt', e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Negative Prompt Input */}
        <div className="space-y-2">
            <div className="flex items-center gap-1.5">
                <label className="text-sm font-medium text-slate-300">Negative Prompt</label>
                <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-800 border border-slate-600 rounded text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Hal-hal yang tidak ingin dimunculkan dalam gambar.
                    </div>
                </div>
            </div>
          <textarea
            className="w-full h-16 bg-slate-800 border border-slate-600 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-red-500/50 focus:border-transparent resize-none transition-all text-sm"
            placeholder="Contoh: teks, blur, jelek, jari rusak, terpotong..."
            value={settings.negativePrompt || ''}
            onChange={(e) => handleChange('negativePrompt', e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Aspect Ratio Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Rasio Aspek</label>
          <div className="grid grid-cols-5 gap-2">
            {ASPECT_RATIOS.map((ratio) => {
              const Icon = ratio.icon;
              const isSelected = settings.aspectRatio === ratio.value;
              return (
                <button
                  key={ratio.value}
                  onClick={() => handleChange('aspectRatio', ratio.value)}
                  disabled={isLoading}
                  title={ratio.label}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">{ratio.value}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {ASPECT_RATIOS.find((r) => r.value === settings.aspectRatio)?.description}
          </p>
        </div>

        {/* Style Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Gaya Artistik</label>
          <select
            value={currentStyleId}
            onChange={handleStyleChange}
            disabled={isLoading}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {STYLE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        {/* Seed Input (Optional) */}
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Seed (Opsional)</label>
                <span className="text-xs text-slate-500">Angka untuk konsistensi</span>
            </div>
            <input 
                type="number" 
                placeholder="Acak jika kosong"
                value={settings.seed || ''}
                onChange={(e) => handleChange('seed', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
        </div>

        {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-200 p-3 rounded-lg text-sm flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
            </div>
        )}

        <button
          onClick={onGenerate}
          disabled={isLoading || !settings.prompt.trim()}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
            isLoading || !settings.prompt.trim()
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-900/20'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sedang Membuat...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Buat 4 Gambar
            </>
          )}
        </button>
      </div>
      
      <div className="mt-8 text-xs text-slate-600 text-center">
        Powered by Google Gemini (Nano Banana)
      </div>
    </aside>
  );
};

export default Sidebar;