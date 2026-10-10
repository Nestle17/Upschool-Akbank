import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  BookOpen,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { TrainingAnalysisResult } from '../types/coach';
import { SAMPLE_TRAINING_PRESETS } from '../data/presets';

interface TabTrainingAnalysisProps {
  trainingResult: TrainingAnalysisResult | null;
  setTrainingResult: (res: TrainingAnalysisResult | null) => void;
  completedTrainings: string;
  setCompletedTrainings: (val: string) => void;
  currentRole: string;
  setCurrentRole: (val: string) => void;
  targetRole: string;
  setTargetRole: (val: string) => void;
  onNavigateToRoadmap: () => void;
}

export const TabTrainingAnalysis: React.FC<TabTrainingAnalysisProps> = ({
  trainingResult,
  setTrainingResult,
  completedTrainings,
  setCompletedTrainings,
  currentRole,
  setCurrentRole,
  targetRole,
  setTargetRole,
  onNavigateToRoadmap,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyPreset = (preset: (typeof SAMPLE_TRAINING_PRESETS)[0]) => {
    setCurrentRole(preset.currentRole);
    setTargetRole(preset.targetRole);
    setCompletedTrainings(preset.completedTrainings);
  };

  const handleAnalyze = async () => {
    if (!completedTrainings.trim()) {
      setError('Lütfen katıldığınız eğitim ve kursların içeriklerini girin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/coach/analyze-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTrainings,
          currentRole: currentRole || 'Mevcut Pozisyon',
          targetRole: targetRole || 'Bir Sonraki Seviye',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Eğitim analizi yapılamadı.');
      }

      const data: TrainingAnalysisResult = await res.json();
      setTrainingResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-1">
            Eğitim Envanteri & Beceri Açığı Analizi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Eğitim İçeriklerinizi Analiz Edin, Bir Sonraki Adımı Keşfedin
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Katıldığınız kursların, bootcamplerin veya sertifika programlarının içeriklerini girin.
            Yapay zeka koçu mevcut birikiminizi sektör standartlarına göre değerlendirsin, seviyenizi tespit etsin
            ve hedeflediğiniz rol için eksik kalan becerileri (skill gap) çıkarsın.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Eğitim Geçmişi ve Kariyer Hedefi
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Hazır Eğitim Profilleri:</span>
            {SAMPLE_TRAINING_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors whitespace-nowrap"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Mevcut Pozisyonunuz / Alanınız
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="Örn: Mid-Level Frontend Developer, Veri Analisti..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Hedeflenen Rol / Sonraki Seviye (Zorunlu) *
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Örn: Senior Fullstack Architect, Lead Data Scientist, PM..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Completed Trainings Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Katıldığınız Eğitimlerin İçerikleri ve Detayları (Zorunlu) *
            </label>
            <span className="text-xs text-slate-500">
              Ders başlıkları, modüller, saat veya kazanımlar
            </span>
          </div>
          <textarea
            rows={7}
            value={completedTrainings}
            onChange={(e) => setCompletedTrainings(e.target.value)}
            placeholder="Katıldığınız eğitimlerin isimlerini ve içeriklerini buraya yapıştırın. Örnek:
- İleri Seviye React ve State Management (40 saat): Redux Toolkit, React Query, Custom Hooks.
- SQL & İlişkisel Veritabanları (25 saat): Indexing, sorgu optimizasyonu, PostgreSQL.
- Docker & CI/CD Temelleri (15 saat): Dockerfile, GitHub Actions ile test pipeline'ı."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleAnalyze}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Eğitim İçerikleri ve Beceri Açığı Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Eğitimleri Analiz Et & Beceri Açığını Çıkar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {trainingResult && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Executive Summary & Level Assessment */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                  Eğitim Değerlendirme Raporu
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Sektör Standartlarına Göre Seviye Tespiti
                </h3>
              </div>

              {/* Level Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Tespit Edilen Seviye:</span>
                <span className="text-sm font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 px-3 py-1 rounded-lg">
                  {trainingResult.currentLevel}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
              {trainingResult.executiveSummary}
            </p>

            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
              <div className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-1">
                Seviye Tespit Gerekçesi:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {trainingResult.levelRationale}
              </p>
            </div>
          </div>

          {/* Acquired Skills vs Missing Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Acquired Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Eğitimlerden Kazanılan Yetkinlikler ({trainingResult.acquiredSkills.length})
                </h4>
              </div>

              <div className="space-y-2.5">
                {trainingResult.acquiredSkills.map((sk, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{sk.skill}</div>
                      <div className="text-slate-400 mt-0.5">{sk.category}</div>
                    </div>
                    <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded">
                      {sk.depth}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills / Skill Gaps */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  Hedef Rol İçin Beceri Açığı ({trainingResult.missingSkills.length})
                </h4>
              </div>

              <div className="space-y-2.5">
                {trainingResult.missingSkills.map((ms, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{ms.skill}</span>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                          ms.importance === 'Kritik'
                            ? 'text-rose-400 bg-rose-950/40 border-rose-900/60'
                            : 'text-amber-400 bg-amber-950/40 border-amber-900/60'
                        }`}
                      >
                        {ms.importance}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{ms.gapDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick CTA to Tab 4 */}
          <div className="p-6 bg-indigo-950/40 border border-indigo-900/60 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">
                Bu açıkların nasıl kapatılacağını görmeye hazır mısınız?
              </h4>
              <p className="text-xs text-indigo-300 mt-1">
                Yapay zeka koçu, mevcut eğitimlerinizin üzerine inşa edilecek kurs önerilerini, global sertifika tavsiyelerini ve 3-6 aylık gelişim planını hazırladı.
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToRoadmap}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
            >
              <span>Eğitim ve Sertifika Yol Haritasını Gör</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
