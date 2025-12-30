import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { DemographicsForm } from './DemographicsForm';
import { GAD7Assessment } from '../Assessments/GAD7Assessment';
import { PHQ9Assessment } from '../Assessments/PHQ9Assessment';
import { DASS21Assessment } from '../Assessments/DASS21Assessment';
import { CVDAssessment } from '../Assessments/CVDAssessment';
import { ResultsDashboard } from './ResultsDashboard';
import { PatientProgressDashboard } from './PatientProgressDashboard';
import TherapyJourney from '../../pages/TherapyJourney';
import { ClipboardList, LogOut, TrendingUp, ArrowLeft, HeartPulse, Stethoscope } from 'lucide-react';

type Step = 'demographics' | 'gad7' | 'phq9' | 'dass21' | 'cvd' | 'results';
type View = 'survey-flow' | 'progress' | 'therapy';



export function PatientDashboard() {
  const { signOut, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('demographics');
  const [currentView, setCurrentView] = useState<View>('survey-flow');
  const [hasDemographics, setHasDemographics] = useState(false);
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const [demographics, assessments] = await Promise.all([
        api.getDemographics(),
        api.getAllAssessments()
      ]);

      setHasDemographics(!!demographics);

      // Check if final assessment (CVD) is completed
      // @ts-ignore
      if (assessments?.cvd) {
        setIsAssessmentComplete(true);
        setCurrentStep('results'); // Default to results
      } else if (demographics) {
        setCurrentStep('gad7');
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleRetakeSurvey = (surveyType: 'gad7' | 'phq9' | 'dass21' | 'cvd') => {
    setCurrentStep(surveyType);
    setCurrentView('survey-flow');
  };

  const handleViewProgress = () => {
    setCurrentView('progress');
  };

  const handleBackToSurvey = () => {
    setCurrentView('survey-flow');
  };

  const scrollToBooking = () => {
    const element = document.getElementById('doctor-booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft to-page">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 text-primary mr-3" />
            <div>
              <h1 className="text-xl font-bold text-secondary">Health Assessment Platform</h1>
              <p className="text-sm text-secondary-light">Welcome, {profile?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Therapy Button */}
            {currentView !== 'therapy' && (
              <button
                onClick={() => setCurrentView('therapy')}
                className="flex items-center px-4 py-2 text-secondary hover:text-black transition font-medium bg-primary-soft rounded-lg hover:bg-primary-light"
              >
                <HeartPulse className="w-5 h-5 mr-2" />
                Therapy & Exercises
              </button>
            )}

            {currentView === 'survey-flow' && hasDemographics && (
              <button
                onClick={handleViewProgress}
                className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition font-medium shadow-md hover:shadow-lg"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                My Progress
              </button>
            )}

            {(currentView === 'progress' || currentView === 'therapy') && (
              <button
                onClick={handleBackToSurvey}
                className="flex items-center px-4 py-2 text-secondary hover:text-black transition font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Surveys
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-secondary hover:text-black transition"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'therapy' ? (
          <TherapyJourney />
        ) : currentView === 'survey-flow' ? (
          <>
            {currentStep === 'results' && isAssessmentComplete && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Action Cards */}
                <div
                  onClick={() => setCurrentView('therapy')}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary-soft rounded-full group-hover:bg-primary/20 transition-colors">
                      <HeartPulse className="w-8 h-8 text-primary" />
                    </div>
                    <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary mb-2">Therapy & Exercises</h3>
                  <p className="text-secondary-light text-sm">
                    Access your personalized therapy journey and mindfulness exercises.
                  </p>
                </div>

                <div
                  onClick={scrollToBooking}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary-soft rounded-full group-hover:bg-primary/20 transition-colors">
                      <Stethoscope className="w-8 h-8 text-primary" />
                    </div>
                    <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary mb-2">Book a Doctor</h3>
                  <p className="text-secondary-light text-sm">
                    Schedule a consultation with a specialist for further evaluation.
                  </p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-secondary">Assessment Progress</h2>
              </div>
              <div className="flex space-x-2">
                {['demographics', 'gad7', 'phq9', 'dass21', 'cvd', 'results'].map((step, index) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full ${['demographics', 'gad7', 'phq9', 'dass21', 'cvd', 'results'].indexOf(currentStep) >= index
                      ? 'bg-primary'
                      : 'bg-primary-soft'
                      }`}
                  />
                ))}
              </div>
              {!isAssessmentComplete && (
                <div className="flex justify-between mt-2 text-xs text-secondary-light">
                  <span>Demographics</span>
                  <span>GAD-7</span>
                  <span>PHQ-9</span>
                  <span>DASS-21</span>
                  <span>CVD</span>
                  <span>Results</span>
                </div>
              )}
            </div>

            {currentStep === 'demographics' && (
              <DemographicsForm onComplete={() => setCurrentStep('gad7')} />
            )}

            {currentStep === 'gad7' && (
              <div>
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-secondary mb-2">GAD-7 Anxiety Assessment</h3>
                  <p className="text-secondary-light mb-4">
                    This assessment will help screen for generalized anxiety disorder. It takes about 2-3 minutes to complete.
                  </p>
                  <button
                    onClick={() => setCurrentStep('gad7')}
                    className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition font-medium shadow-md"
                  >
                    Begin Assessment
                  </button>
                </div>
                <GAD7Assessment onComplete={() => setCurrentStep('phq9')} />
              </div>
            )}

            {currentStep === 'phq9' && (
              <div>
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-secondary mb-2">PHQ-9 Depression Assessment</h3>
                  <p className="text-gray-600 mb-4">
                    This assessment will help screen for depression. It takes about 2-3 minutes to complete.
                  </p>
                </div>
                <PHQ9Assessment onComplete={() => setCurrentStep('dass21')} />
              </div>
            )}

            {currentStep === 'dass21' && (
              <div>
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-secondary mb-2">DASS-21 Assessment</h3>
                  <p className="text-gray-600 mb-4">
                    This assessment evaluates depression, anxiety, and stress. It takes about 5-7 minutes to complete.
                  </p>
                </div>
                <DASS21Assessment onComplete={() => setCurrentStep('cvd')} />
              </div>
            )}

            {currentStep === 'cvd' && (
              <div>
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-secondary mb-2">Cardiovascular Risk Assessment</h3>
                  <p className="text-gray-600 mb-4">
                    This assessment evaluates your cardiovascular health risk factors. It takes about 3-4 minutes to complete.
                  </p>
                </div>
                <CVDAssessment onComplete={() => setCurrentStep('results')} />
              </div>
            )}

            {currentStep === 'results' && <ResultsDashboard onViewProgress={handleViewProgress} />}
          </>
        ) : (
          <PatientProgressDashboard onRetakeSurvey={handleRetakeSurvey} />
        )}
      </div>
    </div>
  );
}
