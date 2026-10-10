import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Copy,
  Check,
  Compass,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import { TrainingAnalysisResult } from '../types/coach';

interface TabCareerRoadmapProps {
  trainingResult: TrainingAnalysisResult | null;
  targetRole: string;
  onNavigateToTraining: () => void;
}

export const TabCareerRoadmap: React.FC<TabCareerRoadmapProps> = ({
  trainingResult,
  targetRole,
  onNavigateToTraining,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!trainingResult) {
    return (
      <div className="border border-slate-800 bg-slate-900 rounded-xl p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center mx-auto text-indigo-400">
          <Compass className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-bold text-white">
            Henüz Eğitim Analizi Yapılmadı
          </h3>
          <p className="text-sm text-slate-400">
            Eğitim geçmişinizi ve hedeflediğiniz rolü girerek analiz başlattığınızda,
            size özel bir sonraki adım kurs önerileri, sertifika tavsiyeleri ve gelişim yol haritası burada görünecektir.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={onNavigateToTraining}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span>Eğitim Analizi Sekmesine Git</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const handleCopyReport = () => {
    const textReport = `KARİYER VE EĞİTİM GELİŞİM RAPORU (${targetRole || 'Hedef Rol'})
-----------------------------------------------------------
Mevcut Seviye: ${trainingResult.currentLevel}
Gerekçe: ${trainingResult.levelRationale}

BİR SONRAKİ ADIM İÇİN ÖNERİLEN EĞİTİMLER:
${trainingResult.recommendedTrainings
  .map(
    (t, i) =>
      `${i + 1}. ${t.title} [${t.priority}] (${t.duration} - ${t.providerOrFormat})\n   Neden: ${t.whyNeeded}`
  )
  .join('\n\n')}

SEKTÖR STANDARDI SERTİFİKA ÖNERİLERİ:
${trainingResult.recommendedCertifications
  .map(
    (c, i) =>
      `${i + 1}. ${c.name} (${c.issuer}) - Zorluk: ${c.difficulty}\n   Etki: ${c.careerImpact}`
  )
  .join('\n\n')}

AŞAMALI GELİŞİM YOL HARİTASI:
${trainingResult.roadmapPhases
  .map(
    (p) =>
      `[${p.phaseName} - ${p.duration}]\n• Odak Beceriler: ${p.focusSkills.join(', ')}\n• Pratik Adım: ${p.practicalAction}\n• Beklenen Çıktı: ${p.expectedOutcome}`
  )
  .join('\n\n')}
`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-1">
            Kariyer ve Yetenek Yol Haritası
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bir Sonraki Adım: Eğitim, Sertifika ve Eylem Planı
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Hedef Rol: <strong className="text-white">{targetRole || 'Yeni Seviye'}</strong> · Tespit Edilen Seviye:{' '}
            <strong className="text-indigo-400">{trainingResult.currentLevel}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyReport}
          className="self-start sm:self-center flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Rapor Kopyalandı!' : 'Tüm Yol Haritasını Kopyala'}</span>
        </button>
      </div>

      {/* 1. Recommended Next-Step Courses / Trainings */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">
              1. Bir Sonraki Adım İçin Alınması Gereken Eğitimler
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {trainingResult.recommendedTrainings.length} Kurs Önerisi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainingResult.recommendedTrainings.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-indigo-400 font-semibold">{t.priority}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{t.duration}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{t.title}</h3>

                <div className="text-xs text-slate-400">
                  <span className="text-slate-500">Format/Platform:</span> {t.providerOrFormat}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-950 text-xs">
                <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold mb-1">
                  Neden Bu Eğitim? (Açığı Nasıl Kapatır?)
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  {t.whyNeeded}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Recommended Industry Standard Certifications */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">
              2. Sektör Standartlarında Sertifika Tavsiyeleri
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Mülakat masasında ve CV'de fark yaratan prestijli unvanlar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trainingResult.recommendedCertifications.map((c, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{c.issuer}</span>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-900/60 px-2 py-0.5 rounded">
                    Zorluk: {c.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{c.name}</h3>
              </div>

              <div className="pt-3 border-t border-slate-950 text-xs">
                <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                  Kariyer & Mülakat Etkisi:
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  {c.careerImpact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Phased Roadmap Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">
              3. Aşamalı Kariyer Gelişim Yol Haritası (3-6 Aylık Eylem Planı)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Öğrenilenlerin gerçek projelerle somutlaştırılması ve hedef role hazır hale gelinmesi için aşamalı plan.
          </p>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-800">
          {trainingResult.roadmapPhases.map((phase) => (
            <div key={phase.phaseNumber} className="relative flex items-start gap-4 pl-1">
              {/* Phase Number Node */}
              <div className="w-9 h-9 rounded-full bg-slate-950 border-2 border-indigo-500 text-indigo-400 font-mono font-bold text-sm flex items-center justify-center shrink-0 z-10">
                {phase.phaseNumber}
              </div>

              {/* Phase Content Box */}
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
                  <h3 className="text-base font-bold text-white">
                    {phase.phaseName}
                  </h3>
                  <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-900/60 px-2.5 py-0.5 rounded self-start sm:self-auto">
                    {phase.duration}
                  </span>
                </div>

                {/* Focus skills */}
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">
                    Odaklanılacak Beceriler:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.focusSkills.map((fs, i) => (
                      <span
                        key={i}
                        className="text-xs text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded"
                      >
                        {fs}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Action */}
                <div className="text-xs space-y-1">
                  <span className="text-amber-400 font-semibold block">
                    Uygulanacak Somut Proje / Pratik Adım:
                  </span>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    {phase.practicalAction}
                  </p>
                </div>

                {/* Expected Outcome */}
                <div className="text-xs space-y-1">
                  <span className="text-emerald-400 font-semibold block">
                    Bu Aşamanın Sonundaki Somut Çıktı:
                  </span>
                  <p className="text-slate-300 leading-relaxed bg-emerald-950/10 p-3 rounded-lg border border-emerald-900/30">
                    {phase.expectedOutcome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
