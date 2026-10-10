import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint 1: Mülakat Katılımcısının Unvanına Özel Soru Üretimi
app.post('/api/coach/generate-questions', async (req, res) => {
  try {
    const {
      interviewerTitle,
      candidateRole,
      companyContext = 'Genel Teknoloji & Kurumsal',
      experienceLevel = 'Mid-Senior',
      questionCount = 6,
    } = req.body;

    if (!interviewerTitle) {
      return res.status(400).json({ error: 'Mülakat katılımcısının unvanı zorunludur.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY tanımlanmamış. Lütfen ortam değişkenlerini kontrol edin.',
      });
    }

    const systemPrompt = `Sen Türkiye'nin en deneyimli baş mülakat koçu ve İK değerlendirme uzmanısın.
Kullanıcı gireceği mülakatın katılımcısı olan kişinin UNVANINI bildirdi: "${interviewerTitle}".
Adayın rolü/hedefi: "${candidateRole || 'Genel Başvuru Sahibi'}".
Şirket / Sektör bağlamı: "${companyContext}".
Deneyim Seviyesi: "${experienceLevel}".

Bu mülakatçının unvanı ve organizasyondaki pozisyonu gereği:
- Masanın o tarafında oturan kişinin (örn. VP, HR Specialist, Team Lead, CTO, Product Director) psikolojisini, şirkette neyi korumaya veya neyi kazanmaya çalıştığını analiz et.
- Bu unvandaki kişinin sorabileceği en stratejik, doğrudan ve derinlikli soruları üret (yaklaşık ${questionCount} adet soru).
- Soruların kategorilerini belirle: 'Teknik & Fonksiyonel', 'Davranışsal & STAR', 'Kültür & Uyum', 'Liderlik & Kriz Yönetimi'.
- Her sorunun ardındaki "Gizli Motivasyon / Neden bu unvan bunu sorar?" açıklamasını net ver.
- Adayın vermesi gereken sinyaller ve unvan sahibinin duymak istediği anahtar kelimeleri listele.
- STAR metodu (Durum, Görev, Eylem, Sonuç) ile cevaplama stratejisi ve ipuçları ver.
- Örnek güçlü cevap açısı / çerçevesi sun.
- Ayrıca adayın mülakatın sonunda BU UNVANDAKİ KİŞİYE sorabileceği 3 adet yüksek etkili, unvan sahibini etkileyecek "Ters Soru" (counter questions) hazırla.
Tüm içerik profesyonel, akıcı ve Türkçe olmalıdır.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Lütfen belirtilen katılımcı unvanına göre kapsamlı mülakat soru matrisini hazırla.',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerPersonaAnalysis: {
              type: Type.STRING,
              description: 'Katılımcı unvanının değerlendirme psikolojisi, öncelikleri ve adayı incelerken odaklandığı ana unsurlar.',
            },
            interviewerFocusAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Bu unvanın en çok baktığı 3-5 temel odak alanı.',
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  category: { type: Type.STRING },
                  rationale: { type: Type.STRING, description: 'Bu unvandaki kişi bu soruyu neden sorar ve arka planda neyi test eder?' },
                  keyIndicators: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Cevapta aranan anahtar sinyaller / yetkinlikler.',
                  },
                  starTips: { type: Type.STRING, description: 'STAR formatında cevaplama taktiği.' },
                  sampleGoodAnswerAngle: { type: Type.STRING, description: 'Örnek güçlü cevap yaklaşımı ve çerçevesi.' },
                },
                required: ['id', 'question', 'category', 'rationale', 'keyIndicators', 'starTips', 'sampleGoodAnswerAngle'],
              },
            },
            counterQuestionsToAsk: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  whyEffective: { type: Type.STRING, description: 'Neden bu soru bu unvandaki kişide harika bir intiba bırakır?' },
                },
                required: ['question', 'whyEffective'],
              },
            },
          },
          required: ['interviewerPersonaAnalysis', 'interviewerFocusAreas', 'questions', 'counterQuestionsToAsk'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({
      error: error.message || 'Mülakat soruları üretilirken bir hata oluştu.',
    });
  }
});

// Endpoint 2: İnteraktif Deneme Mülakatı Yanıt Değerlendirmesi
app.post('/api/coach/evaluate-answer', async (req, res) => {
  try {
    const { question, interviewerTitle, candidateRole, userAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Soru ve aday cevabı zorunludur.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY tanımlanmamış.',
      });
    }

    const systemPrompt = `Sen adayın girdiği mülakatta koçluk yapan üst düzey bir mülakat simülatörüsün.
Mülakatı yapan kişinin unvanı: "${interviewerTitle || 'Mülakatçı'}".
Sorulan Soru: "${question}".
Adayın pozisyonu: "${candidateRole || 'Aday'}".
Adayın Verdiği Cevap: "${userAnswer}".

Lütfen bu cevabı:
1. "${interviewerTitle}" unvanının beklentileri ve değerlendirme kriterleri ışığında analiz et.
2. STAR Metodu (Durum, Görev, Eylem, Sonuç) uyumunu denetle.
3. 100 üzerinden objektif ve yapıcı bir puan ver.
4. Güçlü yönleri ve eksik kalan (veya unvan sahibinin şüphe duyabileceği) noktaları listele.
5. Bu cevabın daha profesyonel, ölçülebilir ve etkili hale getirilmiş örnek bir revize versiyonunu (improvedSampleAnswer) yaz.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Adayın cevabını ayrıntılı analiz et.',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: '100 üzerinden başarı puanı' },
            interviewerImpression: { type: Type.STRING, description: 'Bu unvandaki kişinin bu cevaptan edineceği ilk intiba' },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Cevabın güçlü ve takdir edilesi yönleri',
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Geliştirilmesi gereken kritik boşluklar ve öneriler',
            },
            starAnalysis: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING, description: 'Durum tespiti ve değerlendirmesi' },
                task: { type: Type.STRING, description: 'Görev ve sorumluluk netliği' },
                action: { type: Type.STRING, description: 'Eylem ve adayın bireysel rolü' },
                result: { type: Type.STRING, description: 'Sonuç, metrik ve kazanım analizi' },
              },
              required: ['situation', 'task', 'action', 'result'],
            },
            improvedSampleAnswer: {
              type: Type.STRING,
              description: 'Adayın aynı deneyimi aktarabileceği altın standartta revize edilmiş örnek yanıt',
            },
          },
          required: ['score', 'interviewerImpression', 'strengths', 'improvements', 'starAnalysis', 'improvedSampleAnswer'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({
      error: error.message || 'Cevap değerlendirilirken bir hata oluştu.',
    });
  }
});

// Endpoint 3: Eğitim İçeriklerinin Analizi, Beceri Açığı & Sonraki Adım Yol Haritası
app.post('/api/coach/analyze-training', async (req, res) => {
  try {
    const { completedTrainings, currentRole, targetRole } = req.body;

    if (!completedTrainings) {
      return res.status(400).json({ error: 'Tamamlanan eğitim içerikleri zorunludur.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY tanımlanmamış.',
      });
    }

    const systemPrompt = `Sen Türkiye ve global teknoloji/iş dünyası standartlarına hakim bir Kariyer ve Yetenek Mimarisı Koçusun.
Kullanıcının katıldığı ve tamamladığı eğitimlerin/sertifikaların içerik listesi:
"${completedTrainings}"
Kullanıcının mevcut rolü/pozisyonu: "${currentRole || 'Belirtilmedi'}".
Hedeflediği bir sonraki kariyer rolü/seviyesi: "${targetRole || 'Bir Sonraki Seviye'}".

Kullanıcının ana sorusu:
"Katıldığım eğitimlerin içeriklerini veriyorum. Bu içeriklerden yararlanmak ve bir sonraki adım için nasıl bir eğitim almam gerekir, bana bunu söyle?"

Gereksinimler:
1. MEVCUT SEVİYE VE YETKİNLİK ENVANTERİ:
   - Verilen eğitim içeriklerinden kazanılmış net yetkinlikleri analiz et (acquiredSkills).
   - Sektör standartlarına göre mevcut seviyesini belirle (Junior, Mid-Level, Senior, Lead/Principal) ve bunun kapsamlı gerekçesini sun (currentLevel, levelRationale).
2. BECERİ AÇIĞI (SKILL GAP):
   - Hedeflenen role geçmek için kullanıcının eğitim geçmişinde eksik kalan kritik 4-6 yetkinliği belirle (missingSkills / gaps).
3. BİR SONRAKİ ADIM EĞİTİM ÖNERİLERİ:
   - Mevcut eğitimlerin üzerine inşa edilecek, eksik becerileri kapatacak somut kurs ve eğitim tavsiyeleri (recommendedTrainings: title, providerOrFormat, duration, whyNeeded, priority).
4. SEKTÖR STANDARTLARINDA SERTİFİKA ÖNERİLERİ:
   - Global veya sektörde yüksek geçerliliği olan, CV ve mülakatlarda ağırlık yaratan sertifikalar (recommendedCertifications: name, issuer, difficulty, careerImpact).
5. AŞAMALI GELİŞİM YOL HARİTASI (ROADMAP):
   - 3 aşamalı (örn. 1-2. Ay: Temelleri Pekiştirme, 3-4. Ay: İleri Düzey & Uygulama, 5-6. Ay: Sertifikasyon & Rol Geçişi) zaman çizelgesi.
Tüm metinler profesyonel, ilham verici, somut ve Türkçe olmalıdır.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Kullanıcının eğitim içeriklerini analiz et ve sonraki adım gelişim yol haritasını üret.',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.STRING,
              description: 'Kullanıcının mevcut eğitim birikiminin genel değerlendirmesi ve potansiyeli.',
            },
            currentLevel: {
              type: Type.STRING,
              description: 'Sektör standartlarına göre belirlenen seviye (Junior, Mid-Level, Senior vb.)',
            },
            levelRationale: {
              type: Type.STRING,
              description: 'Bu seviye tespitinin gerekçesi ve eğitim içerikleriyle bağı.',
            },
            acquiredSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  category: { type: Type.STRING },
                  depth: { type: Type.STRING, description: 'Temel, Orta, İleri' },
                },
                required: ['skill', 'category', 'depth'],
              },
            },
            missingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  importance: { type: Type.STRING, description: 'Kritik, Yüksek, Orta' },
                  gapDescription: { type: Type.STRING, description: 'Hedef rol için neden eksik ve ne gerektiriyor?' },
                },
                required: ['skill', 'importance', 'gapDescription'],
              },
            },
            recommendedTrainings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  providerOrFormat: { type: Type.STRING, description: 'Örn. Coursera / DeepLearning.AI / Boot Camp / Uygulamalı Proje' },
                  duration: { type: Type.STRING, description: 'Örn. 4-6 Hafta (Haftalık 5 saat)' },
                  whyNeeded: { type: Type.STRING, description: 'Mevcut eğitimin üzerine ne katacak ve hangi açığı kapatacak?' },
                  priority: { type: Type.STRING, description: '1. Öncelik, 2. Öncelik, 3. Öncelik' },
                },
                required: ['title', 'providerOrFormat', 'duration', 'whyNeeded', 'priority'],
              },
            },
            recommendedCertifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  difficulty: { type: Type.STRING, description: 'Orta, İleri, Uzman' },
                  careerImpact: { type: Type.STRING, description: 'Mülakatlarda ve kariyer geçişinde sağlayacağı prestij' },
                },
                required: ['name', 'issuer', 'difficulty', 'careerImpact'],
              },
            },
            roadmapPhases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.NUMBER },
                  phaseName: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  focusSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  practicalAction: { type: Type.STRING, description: 'Uygulanması önerilen somut proje veya pratik adım' },
                  expectedOutcome: { type: Type.STRING, description: 'Bu aşama bittiğinde kazanılacak somut çıktı' },
                },
                required: ['phaseNumber', 'phaseName', 'duration', 'focusSkills', 'practicalAction', 'expectedOutcome'],
              },
            },
          },
          required: [
            'executiveSummary',
            'currentLevel',
            'levelRationale',
            'acquiredSkills',
            'missingSkills',
            'recommendedTrainings',
            'recommendedCertifications',
            'roadmapPhases',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing training:', error);
    return res.status(500).json({
      error: error.message || 'Eğitim analizi yapılırken bir hata oluştu.',
    });
  }
});

// Vite middleware or Static files
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  const PORT = Number(process.env.PORT) || 3000;

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (dev: ${isDev})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
