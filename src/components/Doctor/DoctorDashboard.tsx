import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { Stethoscope, LogOut, Users, UserPlus, BarChart3, FileText, AlertTriangle } from 'lucide-react';
import { DoctorAnalytics } from './DoctorAnalytics';
import { TreatmentPlans } from './TreatmentPlans';
import { EmergencyAlerts } from '../Shared/EmergencyAlerts';



interface Patient {
  id: string;
  full_name: string;
  created_at: string;
}

interface Caregiver {
  id: string;
  fullName: string;
  email: string;
}

interface PatientAssessment {
  patient: Patient;
  gad7: { total_score: number; severity_level: string; color_code: string } | null;
  phq9: { total_score: number; severity_level: string; color_code: string } | null;
  cvd: { overall_risk: string; overall_color: string } | null;
  caregivers?: Caregiver[];
}

export function DoctorDashboard() {
  const { signOut, profile } = useAuth();
  const [patients, setPatients] = useState<PatientAssessment[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningCaregiver, setAssigningCaregiver] = useState<string | null>(null);
  const [selectedCaregivers, setSelectedCaregivers] = useState<{ [patientId: string]: string }>({});
  const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'patients' | 'analytics' | 'alerts'>('patients');
  const [selectedPatientForPlan, setSelectedPatientForPlan] = useState<{ id: string; name: string } | null>(null);


  useEffect(() => {
    loadPatients();
    loadCaregivers();
  }, []);

  const loadPatients = async () => {
    try {
      const patientsData = await api.getDoctorPatients() as PatientAssessment[];
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCaregivers = async () => {
    try {
      const caregiversData = await api.getAvailableCaregivers() as Caregiver[];
      setCaregivers(caregiversData);
    } catch (error) {
      console.error('Error loading caregivers:', error);
    }
  };

  const handleAssignCaregiver = async (patientId: string) => {
    const caregiverId = selectedCaregivers[patientId];
    if (!caregiverId) return;

    setAssigningCaregiver(patientId);
    setAssignmentError(null);
    setAssignmentSuccess(null);

    try {
      await api.assignCaregiver(caregiverId, patientId);
      setAssignmentSuccess(patientId);

      // Refresh patient list to show updated caregivers
      await loadPatients();

      // Clear selection
      setSelectedCaregivers(prev => {
        const newState = { ...prev };
        delete newState[patientId];
        return newState;
      });

      setTimeout(() => setAssignmentSuccess(null), 3000);
    } catch (error) {
      setAssignmentError(error instanceof Error ? error.message : 'Failed to assign caregiver');
      setTimeout(() => setAssignmentError(null), 5000);
    } finally {
      setAssigningCaregiver(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const getColorBadge = (color: string) => {
    const colors: { [key: string]: string } = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500',
      maroon: 'bg-red-700',
      red: 'bg-red-500',
    };
    return colors[color.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft to-primary-light">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Stethoscope className="w-8 h-8 text-primary mr-3" />
            <div>
              <h1 className="text-xl font-bold text-primary-dark">Doctor Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, Dr. {profile?.full_name}</p>
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
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('patients')}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${activeTab === 'patients'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Users className="w-5 h-5 mr-2" />
                Patient Monitoring
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${activeTab === 'analytics'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${activeTab === 'alerts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Emergency Alerts
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <DoctorAnalytics />
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <EmergencyAlerts userRole="doctor" />
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-primary-dark">Patient Monitoring</h2>
              </div>
              {selectedPatientForPlan && (
                <button
                  onClick={() => setSelectedPatientForPlan(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Back to Patients
                </button>
              )}
            </div>

            {selectedPatientForPlan ? (
              <TreatmentPlans
                patientId={selectedPatientForPlan.id}
                patientName={selectedPatientForPlan.name}
              />
            ) : (
              <>

                {assignmentError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {assignmentError}
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : patients.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No patients assigned yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patients.map((patientData) => (
                      <div key={patientData.patient.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {patientData.patient.full_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Patient since {new Date(patientData.patient.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">GAD-7 Anxiety</h4>
                            {patientData.gad7 ? (
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-gray-800">
                                    {patientData.gad7.total_score}/21
                                  </p>
                                  <p className="text-sm text-gray-600">{patientData.gad7.severity_level}</p>
                                </div>
                                <div className={`w-4 h-4 rounded-full ${getColorBadge(patientData.gad7.color_code)}`} />
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Not completed</p>
                            )}
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">PHQ-9 Depression</h4>
                            {patientData.phq9 ? (
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-gray-800">
                                    {patientData.phq9.total_score}/27
                                  </p>
                                  <p className="text-sm text-gray-600">{patientData.phq9.severity_level}</p>
                                </div>
                                <div className={`w-4 h-4 rounded-full ${getColorBadge(patientData.phq9.color_code)}`} />
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Not completed</p>
                            )}
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">CVD Risk</h4>
                            {patientData.cvd ? (
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-lg font-bold text-gray-800">{patientData.cvd.overall_risk}</p>
                                </div>
                                <div className={`w-4 h-4 rounded-full ${getColorBadge(patientData.cvd.overall_color)}`} />
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Not completed</p>
                            )}
                          </div>
                        </div>

                        {/* Caregiver Assignment Section */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <UserPlus className="w-5 h-5 text-primary mr-2" />
                              <h4 className="text-sm font-semibold text-gray-700">Assigned Caregivers</h4>
                            </div>
                          </div>

                          {patientData.caregivers && patientData.caregivers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {patientData.caregivers.map((caregiver) => (
                                <span
                                  key={caregiver.id}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                >
                                  {caregiver.fullName}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <select
                              value={selectedCaregivers[patientData.patient.id] || ''}
                              onChange={(e) => setSelectedCaregivers(prev => ({
                                ...prev,
                                [patientData.patient.id]: e.target.value
                              }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              disabled={assigningCaregiver === patientData.patient.id}
                            >
                              <option value="">Select a caregiver to assign...</option>
                              {caregivers.map((caregiver) => (
                                <option key={caregiver.id} value={caregiver.id}>
                                  {caregiver.fullName} ({caregiver.email})
                                </option>
                              ))}
                            </select>

                            {assignmentSuccess === patientData.patient.id ? (
                              <div className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                                ✓ Assigned!
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAssignCaregiver(patientData.patient.id)}
                                disabled={
                                  !selectedCaregivers[patientData.patient.id] ||
                                  assigningCaregiver === patientData.patient.id
                                }
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                              >
                                {assigningCaregiver === patientData.patient.id ? 'Assigning...' : 'Assign'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Treatment Plans Button */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <button
                            onClick={() => setSelectedPatientForPlan({ id: patientData.patient.id, name: patientData.patient.full_name })}
                            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Treatment Plans
                          </button>
                        </div>
                      </div>
                    ))}

                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
