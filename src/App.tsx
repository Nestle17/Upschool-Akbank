import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TabInterviewerQuestions } from './components/TabInterviewerQuestions';
import { TabMockInterview } from './components/TabMockInterview';
import { TabTrainingAnalysis } from './components/TabTrainingAnalysis';
import { TabCareerRoadmap } from './components/TabCareerRoadmap';
import { InterviewMatrix, TrainingAnalysisResult } from './types/coach';
import { SAMPLE_INTERVIEW_PRESETS, SAMPLE_TRAINING_PRESETS } from './data/presets';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'questions' | 'mock' | 'training' | 'roadmap'>('questions');

  // Interview state
  const [interviewerTitle, setInterviewerTitle] = useState<string>(() => {
    return localStorage.getItem('coach_interviewerTitle') || SAMPLE_INTERVIEW_PRESETS[0].interviewerTitle;
  });
  const [candidateRole, setCandidateRole] = useState<string>(() => {
    return localStorage.getItem('coach_candidateRole') || SAMPLE_INTERVIEW_PRESETS[0].candidateRole;
  });
  const [companyContext, setCompanyContext] = useState<string>(() => {
    return localStorage.getItem('coach_companyContext') || SAMPLE_INTERVIEW_PRESETS[0].companyContext;
  });
  const [experienceLevel, setExperienceLevel] = useState<string>(() => {
    return localStorage.getItem('coach_experienceLevel') || SAMPLE_INTERVIEW_PRESETS[0].experienceLevel;
  });
  const [interviewMatrix, setInterviewMatrix] = useState<InterviewMatrix | null>(() => {
    const saved = localStorage.getItem('coach_interviewMatrix');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [mockQuestion, setMockQuestion] = useState<string>(() => {
    return localStorage.getItem('coach_mockQuestion') || '';
  });

  // Training & Career state
  const [completedTrainings, setCompletedTrainings] = useState<string>(() => {
    return localStorage.getItem('coach_completedTrainings') || SAMPLE_TRAINING_PRESETS[0].completedTrainings;
  });
  const [currentRole, setCurrentRole] = useState<string>(() => {
    return localStorage.getItem('coach_currentRole') || SAMPLE_TRAINING_PRESETS[0].currentRole;
  });
  const [targetRole, setTargetRole] = useState<string>(() => {
    return localStorage.getItem('coach_targetRole') || SAMPLE_TRAINING_PRESETS[0].targetRole;
  });
  const [trainingResult, setTrainingResult] = useState<TrainingAnalysisResult | null>(() => {
    const saved = localStorage.getItem('coach_trainingResult');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('coach_interviewerTitle', interviewerTitle);
  }, [interviewerTitle]);

  useEffect(() => {
    localStorage.setItem('coach_candidateRole', candidateRole);
  }, [candidateRole]);

  useEffect(() => {
    localStorage.setItem('coach_companyContext', companyContext);
  }, [companyContext]);

  useEffect(() => {
    localStorage.setItem('coach_experienceLevel', experienceLevel);
  }, [experienceLevel]);

  useEffect(() => {
    if (interviewMatrix) {
      localStorage.setItem('coach_interviewMatrix', JSON.stringify(interviewMatrix));
    }
  }, [interviewMatrix]);

  useEffect(() => {
    localStorage.setItem('coach_mockQuestion', mockQuestion);
  }, [mockQuestion]);

  useEffect(() => {
    localStorage.setItem('coach_completedTrainings', completedTrainings);
  }, [completedTrainings]);

  useEffect(() => {
    localStorage.setItem('coach_currentRole', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('coach_targetRole', targetRole);
  }, [targetRole]);

  useEffect(() => {
    if (trainingResult) {
      localStorage.setItem('coach_trainingResult', JSON.stringify(trainingResult));
    }
  }, [trainingResult]);

  const handleSelectForMock = (question: string) => {
    setMockQuestion(question);
    setActiveTab('mock');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetData = () => {
    if (window.confirm('Tüm geçmiş mülakat ve eğitim analiz verilerinizi sıfırlamak istediğinize emin misiniz?')) {
      localStorage.clear();
      setInterviewMatrix(null);
      setTrainingResult(null);
      setMockQuestion('');
      setInterviewerTitle(SAMPLE_INTERVIEW_PRESETS[0].interviewerTitle);
      setCandidateRole(SAMPLE_INTERVIEW_PRESETS[0].candidateRole);
      setCompanyContext(SAMPLE_INTERVIEW_PRESETS[0].companyContext);
      setExperienceLevel(SAMPLE_INTERVIEW_PRESETS[0].experienceLevel);
      setCurrentRole(SAMPLE_TRAINING_PRESETS[0].currentRole);
      setTargetRole(SAMPLE_TRAINING_PRESETS[0].targetRole);
      setCompletedTrainings(SAMPLE_TRAINING_PRESETS[0].completedTrainings);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* SaaS Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasQuestions={!!interviewMatrix}
        hasTrainingAnalysis={!!trainingResult}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'questions' && (
          <TabInterviewerQuestions
            interviewMatrix={interviewMatrix}
            setInterviewMatrix={setInterviewMatrix}
            interviewerTitle={interviewerTitle}
            setInterviewerTitle={setInterviewerTitle}
            candidateRole={candidateRole}
            setCandidateRole={setCandidateRole}
            companyContext={companyContext}
            setCompanyContext={setCompanyContext}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            onSelectForMock={handleSelectForMock}
          />
        )}

        {activeTab === 'mock' && (
          <TabMockInterview
            interviewerTitle={interviewerTitle}
            candidateRole={candidateRole}
            mockQuestion={mockQuestion}
            setMockQuestion={setMockQuestion}
            interviewMatrix={interviewMatrix}
          />
        )}

        {activeTab === 'training' && (
          <TabTrainingAnalysis
            trainingResult={trainingResult}
            setTrainingResult={setTrainingResult}
            completedTrainings={completedTrainings}
            setCompletedTrainings={setCompletedTrainings}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            onNavigateToRoadmap={() => {
              setActiveTab('roadmap');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'roadmap' && (
          <TabCareerRoadmap
            trainingResult={trainingResult}
            targetRole={targetRole}
            onNavigateToTraining={() => {
              setActiveTab('training');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Kariyer & Mülakat Koçu</span>
            <span aria-hidden="true">·</span>
            <span>Google Gemini Destekli Akıllı Koçluk Motoru</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="hover:text-slate-400 flex items-center gap-1 transition-colors"
              title="Önbelleği temizle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Verileri Sıfırla</span>
            </button>
            <span>STAR Metodu & Yetkinlik Mimarisi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
