# Kariyer ve Mülakat Koçu (Career & Interview Coach Agent)

Kullanıcının gireceği mülakat panelindeki katılımcı unvanına (örn. Engineering Manager, HR VP, Senior Product Designer vb.) özel potansiyel sorular, değerlendirme kriterleri ve ipuçları üreten; interaktif deneme mülakatı simülasyonu sunan ve tamamlanan eğitim geçmişini analiz ederek hedeflenen role yönelik beceri açığı tespiti ile bir sonraki adım eğitim ve sertifika yol haritası çıkaran yapay zeka destekli kariyer koçu platformu.

## Onaylanan Kararlar & Kullanıcı Tercihleri

> [!IMPORTANT]
> Kullanıcı ile 1. Aşamada netleştirilen gereksinimler ve mimari kararlar:

- **Dil Tercihi**: Tamamen Türkçe arayüz, soru üretimi, mülakat simülasyonu ve kariyer analiz raporları.
- **Mülakat Koçluğu Seviyesi**: Katılımcı unvanına göre soru üretimi + soru bazlı değerlendirme ipuçları + interaktif deneme mülakatı (mock interview) yanıt simülatörü ve anlık koçluk geri bildirimi.
- **Eğitim Analizi & Yol Haritası**: Hedeflenen pozisyona göre beceri açığı (skill gap) ve kurs önerileri + sektör standartlarına göre seviye tespiti (Junior/Mid/Senior/Lead) ve global geçerliliği olan sertifika tavsiyeleri bir arada sunulacaktır.

---

## 1. Genel Bakış ve Temel Özellikler

Uygulama iki temel ana modülden ve merkezi bir kontrol panelinden oluşur:

### Modül 1: Katılımcı Unvanına Özel Mülakat Simülatörü & Soru Üretici
- **Unvan Analizi**: Kullanıcı mülakatı yapacak kişinin unvanını (örn. *VP of Engineering*, *HR Talent Acquisition Specialist*, *Lead UX Architect*, *Finans Direktörü*) ve isteğe bağlı olarak şirket adını/sektörünü girer.
- **Akıllı Soru Matrisi**: Unvana göre sorular kategorize edilir:
  - *Teknik & Fonksiyonel Yetkinlik*: Kişinin pozisyonuna göre yoklayacağı derinlik.
  - *Davranışsal & Durumsal (STAR Metodu)*: Takım içi çatışma, liderlik, problem çözme.
  - *Stratejik & Kültürel Uyum*: Şirket vizyonu ve organizasyonel uyum soruları.
  - *Ters Soru Önerileri*: "Görüşme sonunda o unvandaki kişiye ne sorulmalı?" rehberi.
- **İnteraktif Deneme Mülakatı (Mock Interview Mode)**:
  - Seçilen sorulardan oluşan canlı mülakat turu.
  - Kullanıcı yanıtını yazar veya taslak olarak iletir.
  - Gemini AI koçu yanıtı STAR tekniğine (Durum, Görev, Eylem, Sonuç), güvenilirlik, açıklık ve unvan sahibinin beklentilerine göre değerlendirir; geliştirme önerisi ve örnek ideal yanıt sunar.

### Modül 2: Eğitim Geçmişi Analizi & Kariyer Gelişim Yol Haritası
- **Eğitim & Sertifika Envanteri**: Kullanıcının aldığı eğitimlerin başlıklarını, içerik özetlerini, kazanılan yetkinlikleri listeleme veya serbest metin olarak yapıştırma imkanı.
- **Hedef Rol & Beceri Açığı (Skill Gap) Analizi**:
  - Kullanıcının hedeflediği pozisyona göre mevcut yetkinliklerin seviye eşleştirmesi.
  - Sektör standartlarına göre mevcut seviye analizi (Junior, Mid-level, Senior, Principal).
- **Sonraki Adım Eğitim & Sertifika Tavsiyesi**:
  - Bir sonraki seviyeye geçmek için eksik olan kritik 3-5 yetkinlik.
  - Tavsiye edilen spesifik eğitim konuları, online kurs içerikleri, pratik proje önerileri ve uluslararası sertifika tavsiyeleri (AWS, PMI, Google, Scrums vb.).
  - Aşamalı 3-6 aylık gelişim yol haritası zaman çizelgesi.

---

## 2. Kullanıcı Deneyimi ve Görsel Tasarım

SaaS Dashboard prensiplerine uygun, yüksek okunabilirliğe sahip, profesyonel bir tasarım dili:

- **Düzen**: Sol tarafta temiz sekme geçişi (Mülakat Hazırlığı, Deneme Mülakatı, Eğitim Analizi, Kariyer Yol Haritası), üst kısımda bağlamsal başlık ve hedef profil özeti, ana alanda odaklanmış çalışma alanı.
- **Tipografi**: Display için `Plus Jakarta Sans` / `Outfit`, okunabilir gövde için `Public Sans` / `DM Sans`, metrik ve aşamalar için `font-mono tabular-nums`.
- **Renk Paleti**:
  - Arka Plan: Nötr Slate (`bg-slate-50 / dark:bg-slate-950`)
  - Kart ve Yüzeyler: Temiz beyaz (`bg-white dark:bg-slate-900`) ve 1px zarif çizgiler (`border-slate-200 dark:border-slate-800`)
  - Vurgu Rengi: Derin Kobalt / İndigo (`#2563eb` - `#4f46e5`) ile profesyonel kurumsal hava
  - Durum Renkleri: Zümrüt Yeşili (Gereksinim tamam / Güçlü yön), Kehribar (Beceri açığı / Gelişim alanı), Mor/Mavi (Hedef rol önerisi)
- **Anti-Slop Disiplini**: Gereksiz hap (pill) yığını yerine temiz tipografik ayırıcılar (`·`), anlamlı durum etiketleri, gerçekçi analiz kriterleri, sıfır sahte telemetri.

---

## 3. Ürün Kararları ve Mimari Tercihler

| Karar Alanı | Seçilen Yaklaşım | Gerekçe |
| :--- | :--- | :--- |
| **Yapay Zeka Modeli** | `gemini-3.8-flash` | Hızlı yanıt süresi, güçlü Türkçe anlama ve yapılandırılmış JSON çıktı üretimi. |
| **Sunucu Tarafı API** | Express / Vite Node.js proxy rotaları (`/api/coach/*`) | API anahtarını tarayıcıdan izole eden güvenli mimari. |
| **Veri Saklama** | Tarayıcı LocalStorage + hazır şablonlar | Kullanıcının girdiği eğitimlerin ve geçmiş mülakat hazırlıklarının sayfa yenilense de kaybolmaması; hızlı deneme için hazır örnek profil kütüphanesi. |
| **Yapılandırılmış Çıktı (JSON)** | `responseSchema` ile tip korumalı JSON üretimi | UI bileşenlerinin (soru kartları, STAR analizleri, yol haritası adımları) hatasız ve kararlı render edilmesi. |

---

## 4. Teknik Mimari ve Veri Akışı

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Kullanıcı Arayüzü (React)                       │
│                                                                        │
│  ┌────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │    Mülakat Koçluğu     │  │     Eğitim & Kariyer Analitiği       │  │
│  │ - Katılımcı Unvanı     │  │ - Tamamlanan Eğitimler & Sertifikalar│  │
│  │ - Soru Üretici (Rol)   │  │ - Hedef Rol & Sektör                 │  │
│  │ - İnteraktif Pratik    │  │ - Beceri Açığı & Sertifika Yol Haritası│  │
│  └───────────┬────────────┘  └──────────────────┬───────────────────┘  │
│              │                                  │                      │
└──────────────┼──────────────────────────────────┼──────────────────────┘
               ▼                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Vite / Express Backend Proxy Katmanı                 │
│                                                                        │
│   POST /api/coach/generate-questions  POST /api/coach/analyze-training │
│   POST /api/coach/evaluate-answer     POST /api/coach/roadmap          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Google GenAI SDK (Server-Side)                     │
│                           gemini-3.8-flash                             │
└────────────────────────────────────────────────────────────────────────┘
```

### Uç Noktalar ve Veri Modelleri:
1. `POST /api/coach/generate-questions`:
   - Girdi: `interviewerTitle`, `candidateRole`, `companyContext`, `experienceLevel`
   - Çıktı: `questions: [{ id, question, category, rationale, starTips, keyThingsInterviewerLooksFor, sampleGoodAnswerAngle }]`, `counterQuestionsToAsk`
2. `POST /api/coach/evaluate-answer`:
   - Girdi: `question`, `interviewerTitle`, `userAnswer`
   - Çıktı: `score`, `strengths`, `improvements`, `starBreakdown`, `suggestedBetterAnswer`
3. `POST /api/coach/analyze-training`:
   - Girdi: `completedTrainings`, `targetRole`, `currentRole`
   - Çıktı: `currentLevelAssessment`, `acquiredSkills`, `missingSkills`, `recommendedTrainings: [{ title, providerOrType, duration, whyNeeded, priority }]`, `recommendedCertifications: [{ name, issuer, difficulty, careerImpact }]`, `roadmapSteps: [{ phase, duration, milestones, focusSkills }]`
