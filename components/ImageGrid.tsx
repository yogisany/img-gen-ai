import React, { useState } from 'react';
import { Download, Maximize2, X, Share2 } from 'lucide-react';

interface ImageGridProps {
  images: string[];
  isGenerating: boolean;
  aspectRatio: string;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, isGenerating, aspectRatio }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Helper to calculate CSS aspect ratio class
  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '1:1': return 'aspect-square';
      case '9:16': return 'aspect-[9/16]';
      case '16:9': return 'aspect-[16/9]';
      case '3:4': return 'aspect-[3/4]';
      case '4:3': return 'aspect-[4/3]';
      default: return 'aspect-square';
    }
  };

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `imajinasi-ai-${Date.now()}-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0 && !isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 h-full min-h-[50vh]">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Share2 className="w-10 h-10 opacity-20" />
        </div>
        <p className="text-lg font-medium">Belum ada gambar</p>
        <p className="text-sm">Masukkan prompt dan tekan tombol buat untuk mulai.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-slate-950">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-5xl mx-auto">
        {/* If generating, show skeletons */}
        {isGenerating ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-full bg-slate-900 rounded-xl animate-pulse border border-slate-800 relative overflow-hidden ${getAspectRatioClass(aspectRatio)}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent absolute top-0 animate-shimmer" />
                <span className="text-slate-700 font-medium text-sm">Generating option {i+1}...</span>
              </div>
            </div>
          ))
        ) : (
          /* Show Images */
          images.map((img, idx) => (
            <div
              key={idx}
              className={`group relative w-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 transition-all hover:border-indigo-500/50 ${getAspectRatioClass(aspectRatio)}`}
            >
              <img
                src={img}
                alt={`Generated ${idx}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <button
                  onClick={() => setSelectedImage(img)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  title="Lihat Penuh"
                >
                  <Maximize2 className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleDownload(img, idx)}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white transition-colors shadow-lg shadow-indigo-600/30"
                  title="Download"
                >
                  <Download className="w-6 h-6" />
                </button>
              </div>
              
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs text-white/80 border border-white/10">
                Variasi #{idx + 1}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-slate-700"
          />
        </div>
      )}
    </div>
  );
};

export default ImageGrid;