import React, { useState } from 'react';
import {
  HelpCircle,
  Briefcase,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  MessageSquare,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Target,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { InterviewMatrix, QuestionItem } from '../types/coach';
import { SAMPLE_INTERVIEW_PRESETS } from '../data/presets';

interface TabInterviewerQuestionsProps {
  interviewMatrix: InterviewMatrix | null;
  setInterviewMatrix: (matrix: InterviewMatrix | null) => void;
  interviewerTitle: string;
  setInterviewerTitle: (title: string) => void;
  candidateRole: string;
  setCandidateRole: (role: string) => void;
  companyContext: string;
  setCompanyContext: (context: string) => void;
  experienceLevel: string;
  setExperienceLevel: (lvl: string) => void;
  onSelectForMock: (question: string) => void;
}

export const TabInterviewerQuestions: React.FC<TabInterviewerQuestionsProps> = ({
  interviewMatrix,
  setInterviewMatrix,
  interviewerTitle,
  setInterviewerTitle,
  candidateRole,
  setCandidateRole,
  companyContext,
  setCompanyContext,
  experienceLevel,
  setExperienceLevel,
  onSelectForMock,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const popularTitles = [
    'Engineering Manager',
    'HR VP & Talent Lead',
    'Chief Technology Officer (CTO)',
    'Head of Product / PM Direktörü',
    'Senior Software Architect',
    'Lead UX / Product Designer',
    'Finans & Bütçe Direktörü',
  ];

  const handleGenerate = async () => {
    if (!interviewerTitle.trim()) {
      setError('Lütfen mülakat yapacak kişinin unvanını belirtin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/coach/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle,
          candidateRole: candidateRole || 'Aday',
          companyContext: companyContext || 'Genel Kurumsal',
          experienceLevel: experienceLevel || 'Mid-Senior',
          questionCount: 6,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Soru üretimi başarısız oldu.');
      }

      const data: InterviewMatrix = await res.json();
      setInterviewMatrix(data);
      if (data.questions?.length > 0) {
        setExpandedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: (typeof SAMPLE_INTERVIEW_PRESETS)[0]) => {
    setInterviewerTitle(preset.interviewerTitle);
    setCandidateRole(preset.candidateRole);
    setCompanyContext(preset.companyContext);
    setExperienceLevel(preset.experienceLevel);
  };

  const categories = interviewMatrix
    ? ['all', ...Array.from(new Set(interviewMatrix.questions.map((q) => q.category)))]
    : ['all'];

  const filteredQuestions =
    selectedCategory === 'all'
      ? interviewMatrix?.questions || []
      : interviewMatrix?.questions.filter((q) => q.category === selectedCategory) || [];

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-1">
            Katılımcı Unvanı Analizi & Soru Simülatörü
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mülakat Katılımcısının Unvanına Özel Sorular ve Strateji
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Mülakatı yapacak kişinin unvanını (örneğin <em>Engineering Manager</em>, <em>HR Direktörü</em> veya <em>CTO</em>) girin.
            Yapay zeka koçu o unvanın değerlendirme psikolojisini çözsün, masanın karşısındakinin sorabileceği en olası soruları,
            neden sorduğunu ve STAR tekniğiyle nasıl yanıtlamanız gerektiğini çıkarsın.
          </p>
        </div>
      </div>

      {/* Input Controls Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Mülakat Parametreleri
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Hızlı Şablonlar:</span>
            {SAMPLE_INTERVIEW_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors whitespace-nowrap"
              >
                {p.name.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Interviewer Title */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Katılımcının Unvanı (Zorunlu) *
            </label>
            <input
              type="text"
              value={interviewerTitle}
              onChange={(e) => setInterviewerTitle(e.target.value)}
              placeholder="Örn: Engineering Manager, HR VP, CTO, Lead Product Designer..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {/* Quick Title Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-xs text-slate-500 self-center mr-1">Önerilen unvanlar:</span>
              {popularTitles.map((title) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => setInterviewerTitle(title)}
                  className="text-xs text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded transition-colors"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>

          {/* Candidate Role */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Başvurduğunuz Pozisyon / Rolünüz
            </label>
            <input
              type="text"
              value={candidateRole}
              onChange={(e) => setCandidateRole(e.target.value)}
              placeholder="Örn: Senior Frontend Developer, Ürün Yöneticisi..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Company / Industry Context */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Şirket / Sektör Türü
            </label>
            <input
              type="text"
              value={companyContext}
              onChange={(e) => setCompanyContext(e.target.value)}
              placeholder="Örn: B2B SaaS, E-Ticaret, Finans / Bankacılık, Yapay Zeka Girişimi..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Experience Level */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Deneyim Seviyesi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Junior (0-2 Yıl)', val: 'Junior (0-2 Yıl)' },
                { label: 'Mid-Level (2-5 Yıl)', val: 'Mid-Level (2-5 Yıl)' },
                { label: 'Senior (5-8 Yıl)', val: 'Senior (5-8 Yıl)' },
                { label: 'Lead / Yönetici (8+ Yıl)', val: 'Lead / Yönetici (8+ Yıl)' },
              ].map((lvl) => (
                <button
                  key={lvl.val}
                  type="button"
                  onClick={() => setExperienceLevel(lvl.val)}
                  className={`py-2 px-3 text-xs rounded-lg border text-center transition-all ${
                    experienceLevel === lvl.val
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
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
            onClick={handleGenerate}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Unvan Analiz Ediliyor ve Sorular Üretiliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Mülakatçı Sorularını ve Stratejiyi Üret</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Results Area */}
      {interviewMatrix && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Persona Analysis Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {interviewerTitle} — Katılımcı Psikolojisi ve Değerlendirme Odağı
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {interviewMatrix.questions.length} Soru Hazırlandı
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
              {interviewMatrix.interviewerPersonaAnalysis}
            </p>

            <div>
              <div className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-2">
                Bu Unvanın En Çok Baktığı 3-5 Temel Sinyal:
              </div>
              <div className="flex flex-wrap gap-2">
                {interviewMatrix.interviewerFocusAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-200 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Potansiyel Mülakat Soruları
            </h3>

            {/* Segmented Filter Control */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Tüm Sorular' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Accordion / Cards */}
          <div className="space-y-4">
            {filteredQuestions.map((q, index) => {
              const isExpanded = expandedQuestionId === q.id;
              return (
                <div
                  key={q.id || index}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-700"
                >
                  {/* Card Header / Click to Expand */}
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono text-indigo-400 font-semibold">Soru {index + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-300 font-medium">{q.category}</span>
                      </div>
                      <h4 className="text-base font-semibold text-white leading-snug">
                        {q.question}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectForMock(q.question);
                        }}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/60 rounded-lg transition-colors whitespace-nowrap"
                        title="Bu soruyla deneme mülakatı yapın"
                      >
                        <span>Pratik Yap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button className="text-slate-400 hover:text-white p-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Coach Breakdown */}
                  {isExpanded && (
                    <div className="border-t border-slate-800 bg-slate-950/80 p-5 space-y-4">
                      {/* Mobile Practice Button */}
                      <div className="sm:hidden pb-2">
                        <button
                          type="button"
                          onClick={() => onSelectForMock(q.question)}
                          className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-700/60 rounded-lg"
                        >
                          <span>Bu Soruyla Deneme Mülakatı Başlat</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Rationale: Why does this title ask this question? */}
                      <div>
                        <div className="text-xs uppercase font-semibold tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                          <span>{interviewerTitle} Bu Soruyu Neden Sorar? (Arka Plan & Niyet)</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                          {q.rationale}
                        </p>
                      </div>

                      {/* Key Indicators */}
                      <div>
                        <div className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-1.5">
                          Cevabınızda Duymak İstediği Anahtar Sinyaller:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {q.keyIndicators.map((ind, i) => (
                            <span
                              key={i}
                              className="text-xs text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md"
                            >
                              • {ind}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* STAR Tips */}
                      <div>
                        <div className="text-xs uppercase font-semibold tracking-wider text-indigo-400 mb-1">
                          STAR Tekniğiyle Yanıtlama Tüyosu:
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed bg-indigo-950/20 border border-indigo-900/40 p-3 rounded-lg">
                          {q.starTips}
                        </p>
                      </div>

                      {/* Sample Good Answer Angle */}
                      <div>
                        <div className="text-xs uppercase font-semibold tracking-wider text-emerald-400 mb-1">
                          Örnek Güçlü Cevap Çerçevesi / Stratejisi:
                        </div>
                        <div className="text-xs text-slate-300 leading-relaxed bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg">
                          {q.sampleGoodAnswerAngle}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Counter-Questions to Ask the Interviewer */}
          {interviewMatrix.counterQuestionsToAsk?.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                  Mülakatın Sonunda Sizin Soracağınız Sorular
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {interviewerTitle} Unvanındaki Kişiye Sorabileceğiniz Yüksek Etkili Ters Sorular
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Mülakatın sonunda "Bize sormak istediğiniz bir soru var mı?" denildiğinde bu soruları yönelterek stratejik düşünce yapınızı kanıtlayabilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {interviewMatrix.counterQuestionsToAsk.map((cq, i) => (
                  <div
                    key={i}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs text-indigo-400 font-mono font-semibold mb-1">
                        Soru Önerisi {i + 1}
                      </div>
                      <p className="text-sm font-semibold text-white leading-snug">
                        "{cq.question}"
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-900">
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">
                        Neden Çok Etkilidir?
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {cq.whyEffective}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
