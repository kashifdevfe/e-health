import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { DemographicsForm } from './DemographicsForm';
import { GAD7Assessment } from '../Assessments/GAD7Assessment';
import { PHQ9Assessment } from '../Assessments/PHQ9Assessment';
import { DASS21Assessment } from '../Assessments/DASS21Assessment';
import { CVDAssessment } from '../Assessments/CVDAssessment';
import { ResultsDashboard } from './ResultsDashboard';
import { ClipboardList, LogOut } from 'lucide-react';

type Step = 'demographics' | 'gad7' | 'phq9' | 'dass21' | 'cvd' | 'results';

export function PatientDashboard() {
  const { signOut, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('demographics');
  const [hasDemographics, setHasDemographics] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDemographics();
  }, []);

  const checkDemographics = async () => {
    try {
      const data = await api.getDemographics();
      setHasDemographics(!!data);
      if (data) {
        setCurrentStep('gad7');
      }
    } catch (error) {
      console.error('Error checking demographics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft to-primary-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft to-primary-light">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 text-primary mr-3" />
            <div>
              <h1 className="text-xl font-bold text-primary-dark">Health Assessment Platform</h1>
              <p className="text-sm text-gray-600">Welcome, {profile?.full_name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 transition"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Assessment Progress</h2>
          </div>
          <div className="flex space-x-2">
            {['demographics', 'gad7', 'phq9', 'dass21', 'cvd', 'results'].map((step, index) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${['demographics', 'gad7', 'phq9', 'dass21', 'cvd', 'results'].indexOf(currentStep) >= index
                    ? 'bg-primary'
                    : 'bg-primary-light'
                  }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Demographics</span>
            <span>GAD-7</span>
            <span>PHQ-9</span>
            <span>DASS-21</span>
            <span>CVD</span>
            <span>Results</span>
          </div>
        </div>

        {currentStep === 'demographics' && (
          <DemographicsForm onComplete={() => setCurrentStep('gad7')} />
        )}

        {currentStep === 'gad7' && (
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-primary-dark mb-2">GAD-7 Anxiety Assessment</h3>
              <p className="text-gray-600 mb-4">
                This assessment will help screen for generalized anxiety disorder. It takes about 2-3 minutes to complete.
              </p>
              <button
                onClick={() => setCurrentStep('gad7')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
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
              <h3 className="text-lg font-semibold text-primary-dark mb-2">PHQ-9 Depression Assessment</h3>
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
              <h3 className="text-lg font-semibold text-primary-dark mb-2">DASS-21 Assessment</h3>
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
              <h3 className="text-lg font-semibold text-primary-dark mb-2">Cardiovascular Risk Assessment</h3>
              <p className="text-gray-600 mb-4">
                This assessment evaluates your cardiovascular health risk factors. It takes about 3-4 minutes to complete.
              </p>
            </div>
            <CVDAssessment onComplete={() => setCurrentStep('results')} />
          </div>
        )}

        {currentStep === 'results' && <ResultsDashboard />}
      </div>
    </div>
  );
}
