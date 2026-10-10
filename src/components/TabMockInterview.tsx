import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Mic,
  MicOff,
  User,
  Award,
  ChevronRight,
  Send,
} from 'lucide-react';
import { AnswerEvaluation, InterviewMatrix } from '../types/coach';

interface TabMockInterviewProps {
  interviewerTitle: string;
  candidateRole: string;
  mockQuestion: string;
  setMockQuestion: (q: string) => void;
  interviewMatrix: InterviewMatrix | null;
}

export const TabMockInterview: React.FC<TabMockInterviewProps> = ({
  interviewerTitle,
  candidateRole,
  mockQuestion,
  setMockQuestion,
  interviewMatrix,
}) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognitionSupported, setRecognitionSupported] = useState<boolean>(false);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setRecognitionSupported(!!SpeechRecognition);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleEvaluate = async () => {
    if (!mockQuestion.trim()) {
      setError('Lütfen pratik yapmak istediğiniz soruyu seçin veya girin.');
      return;
    }
    if (!userAnswer.trim()) {
      setError('Lütfen değerlendirilmesi için yanıtınızı yazın.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/coach/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: mockQuestion,
          interviewerTitle: interviewerTitle || 'Mülakatçı',
          candidateRole: candidateRole || 'Aday',
          userAnswer,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Cevap değerlendirmesi başarısız oldu.');
      }

      const data: AnswerEvaluation = await res.json();
      setEvaluation(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyImproved = () => {
    if (evaluation?.improvedSampleAnswer) {
      navigator.clipboard.writeText(evaluation.improvedSampleAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleQuickQuestions = [
    'En zorlandığınız teknik veya ekip içi çatışma durumunu nasıl yönettiniz?',
    'Bize sıfırdan liderlik ettiğiniz ve ölçülebilir başarı sağladığınız bir projeyi anlatın.',
    'Beklenmedik bir kriz veya kesinti anında nasıl aksiyon aldınız?',
    'Şirketimizin hedeflerine katkı sağlayacağınızı nereden biliyorsunuz?',
  ];

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-1">
            İnteraktif Deneme Mülakatı & STAR Koçluğu
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Canlı Mülakat Simülasyonu ve Yanıt Değerlendirmesi
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Sorulan soruya vereceğiniz cevabı yazın veya sesli olarak aktarın. Koçumuz yanıtınızı{' '}
            <strong>STAR Metodu (Durum, Görev, Eylem, Sonuç)</strong> ve{' '}
            <strong>{interviewerTitle || 'Mülakatçının Unvanı'}</strong> beklentilerine göre puanlasın, güçlü ve zayıf yönleri çıkarsın,
            altın standartta örnek revize bir cevap hazırlasın.
          </p>
        </div>
      </div>

      {/* Question Selection & Context Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">
              Mülakat Bağlamı: {interviewerTitle || 'Genel Mülakatçı'}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Aday Rolü: <strong className="text-slate-200">{candidateRole || 'Aday'}</strong>
          </span>
        </div>

        {/* Question Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Pratik Yapılacak Soru *
            </label>
            {interviewMatrix && interviewMatrix.questions.length > 0 && (
              <span className="text-xs text-indigo-400">
                (Üretilen {interviewMatrix.questions.length} sorudan seçebilirsiniz)
              </span>
            )}
          </div>

          <textarea
            rows={2}
            value={mockQuestion}
            onChange={(e) => setMockQuestion(e.target.value)}
            placeholder="Mülakatta sorulan veya sormasını beklediğiniz soruyu buraya yazın ya da listeden seçin..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          {/* If there are generated questions from Tab 1, show quick picker */}
          {interviewMatrix && interviewMatrix.questions.length > 0 && (
            <div className="pt-1">
              <span className="text-xs text-slate-500 block mb-1.5">
                Üretilen sorulardan hızlıca seç:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {interviewMatrix.questions.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setMockQuestion(q.question)}
                    className={`text-xs text-left px-2.5 py-1 rounded border transition-colors truncate max-w-xs ${
                      mockQuestion === q.question
                        ? 'bg-indigo-900/60 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                    title={q.question}
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick generic questions */}
          {(!interviewMatrix || interviewMatrix.questions.length === 0) && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-xs text-slate-500 self-center mr-1">Örnek sorular:</span>
              {sampleQuickQuestions.map((sq, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMockQuestion(sq)}
                  className="text-xs text-slate-400 hover:text-indigo-300 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded transition-colors"
                >
                  {sq.slice(0, 38)}...
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Answer Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Sizin Yanıtınız (Mülakatta söyleyeceğiniz taslak cevap) *
            </label>
            <div className="flex items-center gap-2">
              {recognitionSupported && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors border ${
                    isRecording
                      ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                      : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  title={isRecording ? 'Dinlemeyi Durdur' : 'Mikrofonla Sesli Cevapla'}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Dinleniyor...' : 'Sesli Konuş'}</span>
                </button>
              )}
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {userAnswer.trim().split(/\s+/).filter(Boolean).length} kelime
              </span>
            </div>
          </div>

          <textarea
            rows={6}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Cevabınızı buraya yazın. İpucu: Yaşadığınız somut bir durumu (Situation), görevinizi (Task), bizzat yaptıklarınızı (Action) ve elde ettiğiniz ölçülebilir sonucu (Result) içerecek şekilde kurgulayın..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleEvaluate}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Yanıtınız STAR Kriterlerine Göre İnceleniyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Cevabı Değerlendir & STAR Koçluk Raporunu Al</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Score & Impression */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                  Mülakatçı Değerlendirme Raporu
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {interviewerTitle || 'Mülakatçı'} Gözünden Cevap Analizi
                </h3>
              </div>

              {/* Score Display */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">STAR Başarı Skoru</div>
                  <div
                    className={`text-2xl font-black font-mono tabular-nums ${
                      evaluation.score >= 80
                        ? 'text-emerald-400'
                        : evaluation.score >= 60
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {evaluation.score}
                    <span className="text-sm font-normal text-slate-500"> / 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Impression Note */}
            <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-1">
                Katılımcının İlk İzlenimi:
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                "{evaluation.interviewerImpression}"
              </p>
            </div>
          </div>

          {/* STAR Breakdown Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              STAR Tekniği Ayrıntılı Kırılımı
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Situation */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400 uppercase tracking-wider">
                    S · Situation (Durum)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluation.starAnalysis.situation}
                </p>
              </div>

              {/* Task */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400 uppercase tracking-wider">
                    T · Task (Görev)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluation.starAnalysis.task}
                </p>
              </div>

              {/* Action */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400 uppercase tracking-wider">
                    A · Action (Eylem)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluation.starAnalysis.action}
                </p>
              </div>

              {/* Result */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400 uppercase tracking-wider">
                    R · Result (Sonuç & Metrik)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluation.starAnalysis.result}
                </p>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                Güçlü ve Takdir Edilen Yönler
              </h4>
              <ul className="space-y-2">
                {evaluation.strengths.map((str, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-300 bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                Geliştirilmesi Gereken Noktalar
              </h4>
              <ul className="space-y-2">
                {evaluation.improvements.map((imp, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-300 bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Golden Standard Revamped Answer */}
          <div className="bg-slate-900 border border-indigo-900/50 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                  Altın Standart
                </span>
                <h4 className="text-base font-bold text-white">
                  Örnek Revize Edilmiş Kusursuz Cevap
                </h4>
              </div>

              <button
                type="button"
                onClick={handleCopyImproved}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
              {evaluation.improvedSampleAnswer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
