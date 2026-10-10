export interface SampleInterviewPreset {
  name: string;
  interviewerTitle: string;
  candidateRole: string;
  companyContext: string;
  experienceLevel: string;
}

export interface SampleTrainingPreset {
  name: string;
  currentRole: string;
  targetRole: string;
  completedTrainings: string;
}

export const SAMPLE_INTERVIEW_PRESETS: SampleInterviewPreset[] = [
  {
    name: 'Engineering Manager (Yazılım Ekip Lideri)',
    interviewerTitle: 'Engineering Manager (Yazılım Mühendisliği Müdürü)',
    candidateRole: 'Senior Frontend / Fullstack Developer',
    companyContext: 'Fintech Scale-Up (B2B Ödeme Sistemleri)',
    experienceLevel: 'Mid-Senior (4-6 Yıl)',
  },
  {
    name: 'HR Director / Talent Acquisition Lead',
    interviewerTitle: 'VP of People & Culture / İK Direktörü',
    candidateRole: 'Ürün Müdürü (Product Manager)',
    companyContext: 'Global E-Ticaret Platformu',
    experienceLevel: 'Senior (6+ Yıl)',
  },
  {
    name: 'Chief Technology Officer (CTO)',
    interviewerTitle: 'Chief Technology Officer (CTO)',
    candidateRole: 'Lead Software Architect',
    companyContext: 'Yapay Zeka ve Bulut Çözümleri Girişimi',
    experienceLevel: 'Senior / Lead (7+ Yıl)',
  },
  {
    name: 'Head of Design / UX Direktörü',
    interviewerTitle: 'Head of Product Design (Tasarım Direktörü)',
    candidateRole: 'Senior Product Designer (UI/UX)',
    companyContext: 'Dijital Bankacılık ve Finans',
    experienceLevel: 'Mid-Level (3-5 Yıl)',
  },
];

export const SAMPLE_TRAINING_PRESETS: SampleTrainingPreset[] = [
  {
    name: 'Modern Web & Frontend Geliştirici',
    currentRole: 'Mid-Level Frontend Developer',
    targetRole: 'Senior Fullstack Architect / Team Lead',
    completedTrainings: `1. İleri Düzey React & TypeScript Mimarisi (40 Saat): Hooks, Context, Custom Hooks, Performance Optimization, TypeScript Generic tipler.
2. Next.js 14 App Router & Server Components Eğitimi (25 Saat): SSR, SSG, Route Handlers, Suspense ve Server Actions.
3. Temel Node.js ve Express ile REST API Geliştirme (20 Saat): Middleware yapısı, JWT Authentication, temel MongoDB CRUD işlemleri.
4. Tailwind CSS ve Responsive UI Tasarımı (15 Saat): Modern CSS kuralları, flexbox, grid, erişilebilirlik (a11y) standartları.
5. Git ve GitHub ile Takım İçi Sürüm Kontrolü (10 Saat): Branching stratejileri, PR review ve merge conflict çözümleri.`,
  },
  {
    name: 'Veri Analisti & İş Zekası',
    currentRole: 'Junior Veri Analisti',
    targetRole: 'Senior Data Scientist & AI Mühendisi',
    completedTrainings: `1. SQL ile İleri Düzey Veri Sorgulama ve Optimizasyon (30 Saat): Window functions, CTEs, index yönetimi, karmaşık join senaryoları.
2. Python ile Veri Analizi ve Manipülasyonu (NumPy & Pandas) (45 Saat): Veri temizleme, istatistiksel analiz, veri dönüştürme.
3. Power BI & Tableau ile Veri Görselleştirme ve Dashboard Tasarımı (30 Saat): DAX hesaplamaları, KPI modelleme, yönetici raporlama ekranları.
4. Temel İstatistik ve A/B Testi Metodolojisi (20 Saat): Hipotez testleri, p-değeri, varyans analizi ve güven aralıkları.`,
  },
  {
    name: 'Proje Yöneticisi & Agile Koçluk',
    currentRole: 'Scrum Master / Proje Koordinatörü',
    targetRole: 'Technical Product Lead / Direktör',
    completedTrainings: `1. Professional Scrum Master (PSM I) Hazırlık Eğitimi (24 Saat): Sprint planlama, retrospektif, impedance removal, backlog önceliklendirme.
2. Jira & Confluence ile Uçtan Uca Proje Yönetimi (16 Saat): Workflow konfigürasyonu, release takibi, burndown chart analizi.
3. Çevik Ekiplerde İletişim ve Çatışma Yönetimi (12 Saat): Empatik dinleme, geribildirim kültürü, paydaş yönetimi.
4. Temel İş Analizi ve Kullanıcı Hikayeleri Yazımı (User Story Mapping) (18 Saat): Acceptance criteria, INVEST kriterleri, değer odaklı backlog yönetimi.`,
  },
];
