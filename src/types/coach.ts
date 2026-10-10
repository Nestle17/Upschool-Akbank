export interface QuestionItem {
  id: string;
  question: string;
  category: string;
  rationale: string;
  keyIndicators: string[];
  starTips: string;
  sampleGoodAnswerAngle: string;
}

export interface CounterQuestion {
  question: string;
  whyEffective: string;
}

export interface InterviewMatrix {
  interviewerPersonaAnalysis: string;
  interviewerFocusAreas: string[];
  questions: QuestionItem[];
  counterQuestionsToAsk: CounterQuestion[];
}

export interface StarAnalysis {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface AnswerEvaluation {
  score: number;
  interviewerImpression: string;
  strengths: string[];
  improvements: string[];
  starAnalysis: StarAnalysis;
  improvedSampleAnswer: string;
}

export interface AcquiredSkill {
  skill: string;
  category: string;
  depth: string;
}

export interface MissingSkill {
  skill: string;
  importance: string;
  gapDescription: string;
}

export interface RecommendedTraining {
  title: string;
  providerOrFormat: string;
  duration: string;
  whyNeeded: string;
  priority: string;
}

export interface RecommendedCertification {
  name: string;
  issuer: string;
  difficulty: string;
  careerImpact: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  duration: string;
  focusSkills: string[];
  practicalAction: string;
  expectedOutcome: string;
}

export interface TrainingAnalysisResult {
  executiveSummary: string;
  currentLevel: string;
  levelRationale: string;
  acquiredSkills: AcquiredSkill[];
  missingSkills: MissingSkill[];
  recommendedTrainings: RecommendedTraining[];
  recommendedCertifications: RecommendedCertification[];
  roadmapPhases: RoadmapPhase[];
}
