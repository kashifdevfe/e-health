import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { Heart, LogOut, Users, Pill, Activity, Apple, Dumbbell, AlertTriangle } from 'lucide-react';

interface Patient {
  id: string;
  full_name: string;
  created_at: string;
}

interface PatientData {
  patient: Patient;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

interface VitalSigns {
  id: string;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  oxygenLevel?: number;
  weight?: number;
  recordedAt: string;
  notes?: string;
}

export function CaregiverDashboard() {
  const { signOut, profile } = useAuth();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'medications' | 'vitals' | 'nutrition' | 'exercise'>('medications');
  const [loading, setLoading] = useState(true);

  // Medications state
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [medicationForm, setMedicationForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
  });

  // Vital Signs state
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenLevel: '',
    weight: '',
    recordedAt: new Date().toISOString().slice(0, 16),
    notes: '',
  });

  // Nutrition state
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const [nutritionForm, setNutritionForm] = useState({
    mealType: 'breakfast',
    foods: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    recordedAt: new Date().toISOString().slice(0, 16),
    notes: '',
  });

  // Exercise state
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseForm, setExerciseForm] = useState({
    exerciseType: '',
    duration: '',
    intensity: 'medium',
    caloriesBurned: '',
    recordedAt: new Date().toISOString().slice(0, 16),
    notes: '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      loadPatientData();
    }
  }, [selectedPatient, activeTab]);

  const loadPatients = async () => {
    try {
      const patientsData = await api.getCaregiverPatients();
      setPatients(patientsData);
      if (patientsData.length > 0) {
        setSelectedPatient(patientsData[0].patient.id);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientData = async () => {
    if (!selectedPatient) return;

    try {
      if (activeTab === 'medications') {
        const meds = await api.getMedications(selectedPatient);
        setMedications(meds);
      } else if (activeTab === 'vitals') {
        const vitals = await api.getVitalSigns(selectedPatient);
        setVitalSigns(vitals);
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      await api.createMedication({
        patientId: selectedPatient,
        ...medicationForm,
      });
      setShowMedicationForm(false);
      setMedicationForm({
        name: '',
        dosage: '',
        frequency: '',
        time: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: '',
      });
      loadPatientData();
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const handleRecordVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      await api.recordVitalSigns({
        patientId: selectedPatient,
        bloodPressure: vitalsForm.bloodPressure || undefined,
        heartRate: vitalsForm.heartRate ? parseInt(vitalsForm.heartRate) : undefined,
        temperature: vitalsForm.temperature ? parseFloat(vitalsForm.temperature) : undefined,
        oxygenLevel: vitalsForm.oxygenLevel ? parseInt(vitalsForm.oxygenLevel) : undefined,
        weight: vitalsForm.weight ? parseFloat(vitalsForm.weight) : undefined,
        recordedAt: vitalsForm.recordedAt,
        notes: vitalsForm.notes || undefined,
      });
      setShowVitalsForm(false);
      setVitalsForm({
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        oxygenLevel: '',
        weight: '',
        recordedAt: new Date().toISOString().slice(0, 16),
        notes: '',
      });
      loadPatientData();
    } catch (error) {
      console.error('Error recording vitals:', error);
    }
  };

  const handleLogNutrition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      await api.createNutritionLog({
        patientId: selectedPatient,
        ...nutritionForm,
        calories: nutritionForm.calories ? parseInt(nutritionForm.calories) : undefined,
        protein: nutritionForm.protein ? parseFloat(nutritionForm.protein) : undefined,
        carbs: nutritionForm.carbs ? parseFloat(nutritionForm.carbs) : undefined,
        fats: nutritionForm.fats ? parseFloat(nutritionForm.fats) : undefined,
      });
      setShowNutritionForm(false);
      setNutritionForm({
        mealType: 'breakfast',
        foods: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        recordedAt: new Date().toISOString().slice(0, 16),
        notes: '',
      });
    } catch (error) {
      console.error('Error logging nutrition:', error);
    }
  };

  const handleLogExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      await api.createExerciseLog({
        patientId: selectedPatient,
        ...exerciseForm,
        duration: parseInt(exerciseForm.duration),
        caloriesBurned: exerciseForm.caloriesBurned ? parseInt(exerciseForm.caloriesBurned) : undefined,
      });
      setShowExerciseForm(false);
      setExerciseForm({
        exerciseType: '',
        duration: '',
        intensity: 'medium',
        caloriesBurned: '',
        recordedAt: new Date().toISOString().slice(0, 16),
        notes: '',
      });
    } catch (error) {
      console.error('Error logging exercise:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const selectedPatientData = patients.find(p => p.patient.id === selectedPatient);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Caregiver Dashboard</h1>
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : patients.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No patients assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Patient Selector */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Patient
              </label>
              <select
                value={selectedPatient || ''}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {patients.map((p) => (
                  <option key={p.patient.id} value={p.patient.id}>
                    {p.patient.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('medications')}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${activeTab === 'medications'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Pill className="w-5 h-5 mr-2" />
                    Medications
                  </button>
                  <button
                    onClick={() => setActiveTab('vitals')}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${activeTab === 'vitals'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    Vital Signs
                  </button>
                  <button
                    onClick={() => setActiveTab('nutrition')}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${activeTab === 'nutrition'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Apple className="w-5 h-5 mr-2" />
                    Nutrition
                  </button>
                  <button
                    onClick={() => setActiveTab('exercise')}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${activeTab === 'exercise'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Dumbbell className="w-5 h-5 mr-2" />
                    Exercise
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* Medications Tab */}
                {activeTab === 'medications' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Medication Schedule</h3>
                      <button
                        onClick={() => setShowMedicationForm(!showMedicationForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        {showMedicationForm ? 'Cancel' : 'Add Medication'}
                      </button>
                    </div>

                    {showMedicationForm && (
                      <form onSubmit={handleAddMedication} className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
                            <input
                              type="text"
                              required
                              value={medicationForm.name}
                              onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                            <input
                              type="text"
                              required
                              value={medicationForm.dosage}
                              onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                              placeholder="e.g., 500mg"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                            <input
                              type="text"
                              required
                              value={medicationForm.frequency}
                              onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })}
                              placeholder="e.g., Twice daily"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                            <input
                              type="text"
                              required
                              value={medicationForm.time}
                              onChange={(e) => setMedicationForm({ ...medicationForm, time: e.target.value })}
                              placeholder="e.g., 8:00 AM, 8:00 PM"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                            <input
                              type="date"
                              required
                              value={medicationForm.startDate}
                              onChange={(e) => setMedicationForm({ ...medicationForm, startDate: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                            <input
                              type="date"
                              value={medicationForm.endDate}
                              onChange={(e) => setMedicationForm({ ...medicationForm, endDate: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                          <textarea
                            value={medicationForm.notes}
                            onChange={(e) => setMedicationForm({ ...medicationForm, notes: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Save Medication
                        </button>
                      </form>
                    )}

                    <div className="space-y-3">
                      {medications.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No medications recorded yet.</p>
                      ) : (
                        medications.map((med) => (
                          <div key={med.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-800">{med.name}</h4>
                                <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                                <p className="text-sm text-gray-600">Time: {med.time}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Start: {new Date(med.startDate).toLocaleDateString()}
                                  {med.endDate && ` - End: ${new Date(med.endDate).toLocaleDateString()}`}
                                </p>
                                {med.notes && <p className="text-sm text-gray-600 mt-2">{med.notes}</p>}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Vital Signs Tab */}
                {activeTab === 'vitals' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Vital Signs History</h3>
                      <button
                        onClick={() => setShowVitalsForm(!showVitalsForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        {showVitalsForm ? 'Cancel' : 'Record Vitals'}
                      </button>
                    </div>

                    {showVitalsForm && (
                      <form onSubmit={handleRecordVitals} className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                            <input
                              type="text"
                              value={vitalsForm.bloodPressure}
                              onChange={(e) => setVitalsForm({ ...vitalsForm, bloodPressure: e.target.value })}
                              placeholder="e.g., 120/80"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                            <input
                              type="number"
                              value={vitalsForm.heartRate}
                              onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={vitalsForm.temperature}
                              onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Level (%)</label>
                            <input
                              type="number"
                              value={vitalsForm.oxygenLevel}
                              onChange={(e) => setVitalsForm({ ...vitalsForm, oxygenLevel: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={vitalsForm.weight}
                              onChange={(e) => setVitalsForm({ ...vitalsForm, weight: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recorded At *</label>
                            <input
                              type="datetime-local"
                              required
                              value={vitalsForm.recordedAt}
                              onChange={(e) => setVitalsForm({ ...vitalsForm, recordedAt: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                          <textarea
                            value={vitalsForm.notes}
                            onChange={(e) => setVitalsForm({ ...vitalsForm, notes: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Save Vital Signs
                        </button>
                      </form>
                    )}

                    <div className="space-y-3">
                      {vitalSigns.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No vital signs recorded yet.</p>
                      ) : (
                        vitalSigns.map((vital) => (
                          <div key={vital.id} className="border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-2">
                              {new Date(vital.recordedAt).toLocaleString()}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              {vital.bloodPressure && (
                                <div>
                                  <p className="text-xs text-gray-500">Blood Pressure</p>
                                  <p className="font-semibold">{vital.bloodPressure}</p>
                                </div>
                              )}
                              {vital.heartRate && (
                                <div>
                                  <p className="text-xs text-gray-500">Heart Rate</p>
                                  <p className="font-semibold">{vital.heartRate} bpm</p>
                                </div>
                              )}
                              {vital.temperature && (
                                <div>
                                  <p className="text-xs text-gray-500">Temperature</p>
                                  <p className="font-semibold">{vital.temperature}°F</p>
                                </div>
                              )}
                              {vital.oxygenLevel && (
                                <div>
                                  <p className="text-xs text-gray-500">Oxygen</p>
                                  <p className="font-semibold">{vital.oxygenLevel}%</p>
                                </div>
                              )}
                              {vital.weight && (
                                <div>
                                  <p className="text-xs text-gray-500">Weight</p>
                                  <p className="font-semibold">{vital.weight} lbs</p>
                                </div>
                              )}
                            </div>
                            {vital.notes && <p className="text-sm text-gray-600 mt-2">{vital.notes}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Nutrition Tab */}
                {activeTab === 'nutrition' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Nutrition Tracking</h3>
                      <button
                        onClick={() => setShowNutritionForm(!showNutritionForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        {showNutritionForm ? 'Cancel' : 'Log Meal'}
                      </button>
                    </div>

                    {showNutritionForm && (
                      <form onSubmit={handleLogNutrition} className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type *</label>
                            <select
                              required
                              value={nutritionForm.mealType}
                              onChange={(e) => setNutritionForm({ ...nutritionForm, mealType: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="breakfast">Breakfast</option>
                              <option value="lunch">Lunch</option>
                              <option value="dinner">Dinner</option>
                              <option value="snack">Snack</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recorded At *</label>
                            <input
                              type="datetime-local"
                              required
                              value={nutritionForm.recordedAt}
                              onChange={(e) => setNutritionForm({ ...nutritionForm, recordedAt: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Foods *</label>
                          <textarea
                            required
                            value={nutritionForm.foods}
                            onChange={(e) => setNutritionForm({ ...nutritionForm, foods: e.target.value })}
                            placeholder="List the foods consumed..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                            <input
                              type="number"
                              value={nutritionForm.calories}
                              onChange={(e) => setNutritionForm({ ...nutritionForm, calories: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={nutritionForm.protein}
                              onChange={(e) => setNutritionForm({ ...nutritionForm, protein: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={nutritionForm.carbs}
                              onChange={(e) => setNutritionForm({ ...nutritionForm, carbs: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={nutritionForm.fats}
                              onChange={(e) => setNutritionForm({ ...nutritionForm, fats: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                          <textarea
                            value={nutritionForm.notes}
                            onChange={(e) => setNutritionForm({ ...nutritionForm, notes: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Save Nutrition Log
                        </button>
                      </form>
                    )}

                    <p className="text-gray-500 text-center py-8">Nutrition logs will appear here.</p>
                  </div>
                )}

                {/* Exercise Tab */}
                {activeTab === 'exercise' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Exercise Monitoring</h3>
                      <button
                        onClick={() => setShowExerciseForm(!showExerciseForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        {showExerciseForm ? 'Cancel' : 'Log Exercise'}
                      </button>
                    </div>

                    {showExerciseForm && (
                      <form onSubmit={handleLogExercise} className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Type *</label>
                            <input
                              type="text"
                              required
                              value={exerciseForm.exerciseType}
                              onChange={(e) => setExerciseForm({ ...exerciseForm, exerciseType: e.target.value })}
                              placeholder="e.g., Walking, Swimming"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                            <input
                              type="number"
                              required
                              value={exerciseForm.duration}
                              onChange={(e) => setExerciseForm({ ...exerciseForm, duration: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Intensity *</label>
                            <select
                              required
                              value={exerciseForm.intensity}
                              onChange={(e) => setExerciseForm({ ...exerciseForm, intensity: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
                            <input
                              type="number"
                              value={exerciseForm.caloriesBurned}
                              onChange={(e) => setExerciseForm({ ...exerciseForm, caloriesBurned: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recorded At *</label>
                            <input
                              type="datetime-local"
                              required
                              value={exerciseForm.recordedAt}
                              onChange={(e) => setExerciseForm({ ...exerciseForm, recordedAt: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                          <textarea
                            value={exerciseForm.notes}
                            onChange={(e) => setExerciseForm({ ...exerciseForm, notes: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Save Exercise Log
                        </button>
                      </form>
                    )}

                    <p className="text-gray-500 text-center py-8">Exercise logs will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
