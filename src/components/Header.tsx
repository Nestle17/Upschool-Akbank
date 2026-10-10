import React from 'react';
import { Sparkles, Compass, HelpCircle, GraduationCap, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'questions' | 'mock' | 'training' | 'roadmap';
  setActiveTab: (tab: 'questions' | 'mock' | 'training' | 'roadmap') => void;
  hasQuestions: boolean;
  hasTrainingAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasQuestions,
  hasTrainingAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-sm">
            KK
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Kariyer & Mülakat Koçu
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clean hover and active underline) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('questions')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 py-1 border-b-2 ${
              activeTab === 'questions'
                ? 'text-indigo-400 border-indigo-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>Mülakatçı Soru Üretici</span>
            {hasQuestions && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Sorular hazır" />}
          </button>

          <button
            onClick={() => setActiveTab('mock')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 py-1 border-b-2 ${
              activeTab === 'mock'
                ? 'text-indigo-400 border-indigo-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>Deneme Mülakatı & STAR</span>
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 py-1 border-b-2 ${
              activeTab === 'training'
                ? 'text-indigo-400 border-indigo-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>Eğitim Analizi & Beceri Açığı</span>
            {hasTrainingAnalysis && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Analiz tamamlandı" />}
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 py-1 border-b-2 ${
              activeTab === 'roadmap'
                ? 'text-indigo-400 border-indigo-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>Kariyer & Sertifika Yol Haritası</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Quick Context Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span>Gemini AI Aktif</span>
          </div>
          <button
            onClick={() => {
              if (activeTab === 'questions' || activeTab === 'mock') {
                setActiveTab('training');
              } else {
                setActiveTab('questions');
              }
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            {activeTab === 'questions' || activeTab === 'mock' ? 'Eğitim Analizine Geç' : 'Mülakat Hazırlığına Geç'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-slate-900 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-2 py-1 rounded ${activeTab === 'questions' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Soru Üretici
        </button>
        <button
          onClick={() => setActiveTab('mock')}
          className={`px-2 py-1 rounded ${activeTab === 'mock' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Pratik (STAR)
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-2 py-1 rounded ${activeTab === 'training' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Eğitim Analizi
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-2 py-1 rounded ${activeTab === 'roadmap' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Yol Haritası
        </button>
      </div>
    </header>
  );
};
