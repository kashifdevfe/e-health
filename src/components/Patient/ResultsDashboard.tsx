import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { CheckCircle2, AlertCircle, Stethoscope, Mail, Calendar } from 'lucide-react';

interface Results {
  gad7: {
    total_score: number;
    severity_level: string;
    color_code: string;
  } | null;
  phq9: {
    total_score: number;
    severity_level: string;
    color_code: string;
    functional_impact: string;
  } | null;
  dass21: {
    depression_score: number;
    anxiety_score: number;
    stress_score: number;
    depression_severity: string;
    anxiety_severity: string;
    stress_severity: string;
    depression_color: string;
    anxiety_color: string;
    stress_color: string;
  } | null;
  cvd: {
    overall_risk: string;
    overall_color: string;
  } | null;
}

interface Doctor {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

// Traffic Light Component
const TrafficLight = ({ color, label, score }: { color: string; label: string; score?: string }) => {
  const getColorClass = (lightColor: string) => {
    const baseClasses = 'w-20 h-20 rounded-full border-4 flex items-center justify-center font-bold text-lg transition-all duration-300';

    switch (lightColor.toLowerCase()) {
      case 'green':
        return `${baseClasses} bg-green-500 border-green-600 shadow-lg shadow-green-500/50`;
      case 'yellow':
        return `${baseClasses} bg-yellow-400 border-yellow-500 shadow-lg shadow-yellow-400/50`;
      case 'orange':
        return `${baseClasses} bg-orange-500 border-orange-600 shadow-lg shadow-orange-500/50`;
      case 'maroon':
        return `${baseClasses} bg-red-700 border-red-800 shadow-lg shadow-red-700/50`;
      case 'red':
        return `${baseClasses} bg-red-500 border-red-600 shadow-lg shadow-red-500/50`;
      default:
        return `${baseClasses} bg-gray-400 border-gray-500`;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-4">
      <div className={getColorClass(color)}>
        <span className="text-white drop-shadow-lg">{score}</span>
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-800 text-sm">{label}</p>
      </div>
    </div>
  );
};

export function ResultsDashboard() {
  const { } = useAuth();
  const [results, setResults] = useState<Results>({
    gad7: null,
    phq9: null,
    dass21: null,
    cvd: null,
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
    loadDoctors();
  }, []);

  const loadResults = async () => {
    try {
      const data = await api.getAllAssessments() as any;

      setResults({
        gad7: data.gad7 ? {
          total_score: data.gad7.totalScore,
          severity_level: data.gad7.severityLevel,
          color_code: data.gad7.colorCode,
        } : null,
        phq9: data.phq9 ? {
          total_score: data.phq9.totalScore,
          severity_level: data.phq9.severityLevel,
          color_code: data.phq9.colorCode,
          functional_impact: data.phq9.functionalImpact || '',
        } : null,
        dass21: data.dass21 ? {
          depression_score: data.dass21.depressionScore,
          anxiety_score: data.dass21.anxietyScore,
          stress_score: data.dass21.stressScore,
          depression_severity: data.dass21.depressionSeverity,
          anxiety_severity: data.dass21.anxietySeverity,
          stress_severity: data.dass21.stressSeverity,
          depression_color: data.dass21.depressionColor,
          anxiety_color: data.dass21.anxietyColor,
          stress_color: data.dass21.stressColor,
        } : null,
        cvd: data.cvd ? {
          overall_risk: data.cvd.overallRisk,
          overall_color: data.cvd.overallColor,
        } : null,
      });
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const doctorsData = await api.getAvailableDoctors() as Doctor[];
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleBookAppointment = async (doctorId: string) => {
    setBookingLoading(doctorId);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      await api.bookAppointment(doctorId);
      setBookingSuccess(doctorId);
      setTimeout(() => setBookingSuccess(null), 3000);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Failed to book appointment');
      setTimeout(() => setBookingError(null), 5000);
    } finally {
      setBookingLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasHighRisk =
    results.gad7?.color_code === 'red' ||
    results.phq9?.color_code === 'red' ||
    results.dass21?.depression_color === 'red' ||
    results.dass21?.anxiety_color === 'red' ||
    results.dass21?.stress_color === 'red' ||
    results.cvd?.overall_color === 'red';

  return (
    <div className="space-y-8">
      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-primary mr-3" />
          <h2 className="text-2xl font-bold text-primary-dark">Your Assessment Results</h2>
        </div>

        {hasHighRisk && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Important Notice</h3>
                <p className="text-sm text-red-700 mb-2">
                  Your assessment indicates high-risk scores in one or more areas. We strongly recommend booking an appointment with a doctor for further evaluation.
                </p>
                <p className="text-sm text-red-700 font-medium">
                  If you have severe symptoms or are in crisis, please seek immediate medical attention or call emergency services.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Traffic Lights Display */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Severity Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-gray-50 rounded-lg p-6">
            {results.gad7 && (
              <TrafficLight
                color={results.gad7.color_code}
                label={`GAD-7 Anxiety\n${results.gad7.severity_level}`}
                score={`${results.gad7.total_score}/21`}
              />
            )}

            {results.phq9 && (
              <TrafficLight
                color={results.phq9.color_code}
                label={`PHQ-9 Depression\n${results.phq9.severity_level}`}
                score={`${results.phq9.total_score}/27`}
              />
            )}

            {results.dass21 && (
              <>
                <TrafficLight
                  color={results.dass21.depression_color}
                  label={`DASS-21 Depression\n${results.dass21.depression_severity}`}
                  score={`${results.dass21.depression_score}`}
                />
                <TrafficLight
                  color={results.dass21.anxiety_color}
                  label={`DASS-21 Anxiety\n${results.dass21.anxiety_severity}`}
                  score={`${results.dass21.anxiety_score}`}
                />
                <TrafficLight
                  color={results.dass21.stress_color}
                  label={`DASS-21 Stress\n${results.dass21.stress_severity}`}
                  score={`${results.dass21.stress_score}`}
                />
              </>
            )}

            {results.cvd && (
              <TrafficLight
                color={results.cvd.overall_color}
                label={`CVD Risk\n${results.cvd.overall_risk}`}
              />
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary-soft border border-primary-light rounded-lg">
          <h3 className="font-semibold text-primary-dark mb-2">About These Results</h3>
          <p className="text-sm text-primary">
            These assessments are screening tools only and do not constitute a medical diagnosis. Please consult with a healthcare professional to discuss your results and determine appropriate next steps.
          </p>
        </div>
      </div>

      {/* Doctor Booking Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Stethoscope className="w-8 h-8 text-primary mr-3" />
          <h2 className="text-2xl font-bold text-primary-dark">Book an Appointment</h2>
        </div>

        {bookingError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {bookingError}
          </div>
        )}

        {doctors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No doctors available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center mr-3">
                      <Stethoscope className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Dr. {doctor.fullName}</h3>
                      <p className="text-xs text-gray-500">General Physician</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Available for consultation</span>
                  </div>
                </div>

                {bookingSuccess === doctor.id ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm text-center">
                    ✓ Appointment Booked!
                  </div>
                ) : (
                  <button
                    onClick={() => handleBookAppointment(doctor.id)}
                    disabled={bookingLoading === doctor.id}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {bookingLoading === doctor.id ? 'Booking...' : 'Book Appointment'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Booking an appointment will assign you to the selected doctor. They will be able to monitor your assessment results and provide guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
