import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import {
    ClipboardList,
    Activity,
    Heart,
    Pill,
    Calendar,
    User,
    RefreshCw,
    FileText,
    Apple,
    Dumbbell
} from 'lucide-react';

interface AssessmentHistory {
    gad7: any[];
    phq9: any[];
    cvd: any[];
    dass21: any[];
}

interface TreatmentPlan {
    id: string;
    title: string;
    description: string;
    goals: string;
    medications: string;
    exercises: string;
    dietPlan: string;
    status: string;
    startDate: string;
    endDate: string | null;
    createdAt: string;
    doctor: {
        id: string;
        fullName: string;
        email: string;
    };
}

interface CareActivities {
    medications: any[];
    vitalSigns: any[];
    nutritionLogs: any[];
    exerciseLogs: any[];
}

interface PatientProgressDashboardProps {
    onRetakeSurvey: (surveyType: 'gad7' | 'phq9' | 'dass21' | 'cvd') => void;
}

export function PatientProgressDashboard({ onRetakeSurvey }: PatientProgressDashboardProps) {
    const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory>({
        gad7: [],
        phq9: [],
        cvd: [],
        dass21: [],
    });
    const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
    const [careActivities, setCareActivities] = useState<CareActivities>({
        medications: [],
        vitalSigns: [],
        nutritionLogs: [],
        exerciseLogs: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProgressData();
    }, []);

    const loadProgressData = async () => {
        try {
            const [history, plans, activities] = await Promise.all([
                api.getAssessmentHistory() as Promise<AssessmentHistory>,
                api.getPatientTreatmentPlans() as Promise<TreatmentPlan[]>,
                api.getPatientCareActivities() as Promise<CareActivities>,
            ]);

            setAssessmentHistory(history);
            setTreatmentPlans(plans);
            setCareActivities(activities);
        } catch (error) {
            console.error('Error loading progress data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getColorClass = (color: string) => {
        switch (color?.toLowerCase()) {
            case 'green':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'yellow':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'orange':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'maroon':
            case 'red':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Assessment History Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <ClipboardList className="w-8 h-8 text-primary mr-3" />
                        <h2 className="text-2xl font-bold text-primary-dark">Assessment History</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* GAD-7 History */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">GAD-7 Anxiety</h3>
                            <button
                                onClick={() => onRetakeSurvey('gad7')}
                                className="flex items-center text-sm text-primary hover:text-primary-dark transition"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Retake
                            </button>
                        </div>
                        {assessmentHistory.gad7.length === 0 ? (
                            <p className="text-sm text-gray-500">No assessments yet</p>
                        ) : (
                            <div className="space-y-2">
                                {assessmentHistory.gad7.slice(0, 3).map((assessment, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{formatDate(assessment.completedAt)}</span>
                                        <span className={`px-2 py-1 rounded border ${getColorClass(assessment.colorCode)}`}>
                                            {assessment.totalScore}/21 - {assessment.severityLevel}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* PHQ-9 History */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">PHQ-9 Depression</h3>
                            <button
                                onClick={() => onRetakeSurvey('phq9')}
                                className="flex items-center text-sm text-primary hover:text-primary-dark transition"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Retake
                            </button>
                        </div>
                        {assessmentHistory.phq9.length === 0 ? (
                            <p className="text-sm text-gray-500">No assessments yet</p>
                        ) : (
                            <div className="space-y-2">
                                {assessmentHistory.phq9.slice(0, 3).map((assessment, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{formatDate(assessment.completedAt)}</span>
                                        <span className={`px-2 py-1 rounded border ${getColorClass(assessment.colorCode)}`}>
                                            {assessment.totalScore}/27 - {assessment.severityLevel}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* DASS-21 History */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">DASS-21</h3>
                            <button
                                onClick={() => onRetakeSurvey('dass21')}
                                className="flex items-center text-sm text-primary hover:text-primary-dark transition"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Retake
                            </button>
                        </div>
                        {assessmentHistory.dass21.length === 0 ? (
                            <p className="text-sm text-gray-500">No assessments yet</p>
                        ) : (
                            <div className="space-y-2">
                                {assessmentHistory.dass21.slice(0, 3).map((assessment, index) => (
                                    <div key={index} className="text-sm">
                                        <div className="text-gray-600 mb-1">{formatDate(assessment.completedAt)}</div>
                                        <div className="flex flex-wrap gap-1">
                                            <span className={`px-2 py-1 rounded border text-xs ${getColorClass(assessment.depressionColor)}`}>
                                                D: {assessment.depressionScore}
                                            </span>
                                            <span className={`px-2 py-1 rounded border text-xs ${getColorClass(assessment.anxietyColor)}`}>
                                                A: {assessment.anxietyScore}
                                            </span>
                                            <span className={`px-2 py-1 rounded border text-xs ${getColorClass(assessment.stressColor)}`}>
                                                S: {assessment.stressScore}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CVD History */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">CVD Risk</h3>
                            <button
                                onClick={() => onRetakeSurvey('cvd')}
                                className="flex items-center text-sm text-primary hover:text-primary-dark transition"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Retake
                            </button>
                        </div>
                        {assessmentHistory.cvd.length === 0 ? (
                            <p className="text-sm text-gray-500">No assessments yet</p>
                        ) : (
                            <div className="space-y-2">
                                {assessmentHistory.cvd.slice(0, 3).map((assessment, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{formatDate(assessment.completedAt)}</span>
                                        <span className={`px-2 py-1 rounded border ${getColorClass(assessment.overallColor)}`}>
                                            {assessment.overallRisk}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Treatment Plans Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                    <FileText className="w-8 h-8 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-primary-dark">Treatment Plans</h2>
                </div>

                {treatmentPlans.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No treatment plans assigned yet.</p>
                        <p className="text-sm text-gray-500 mt-2">Book an appointment with a doctor to get a personalized treatment plan.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {treatmentPlans.map((plan) => (
                            <div key={plan.id} className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <User className="w-4 h-4 mr-1" />
                                            Dr. {plan.doctor.fullName}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {plan.status}
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-4">{plan.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    {plan.goals && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-1">Goals</h4>
                                            <p className="text-gray-600">{plan.goals}</p>
                                        </div>
                                    )}
                                    {plan.medications && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-1">Medications</h4>
                                            <p className="text-gray-600">{plan.medications}</p>
                                        </div>
                                    )}
                                    {plan.exercises && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-1">Exercises</h4>
                                            <p className="text-gray-600">{plan.exercises}</p>
                                        </div>
                                    )}
                                    {plan.dietPlan && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-1">Diet Plan</h4>
                                            <p className="text-gray-600">{plan.dietPlan}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {formatDate(plan.startDate)} - {plan.endDate ? formatDate(plan.endDate) : 'Ongoing'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Care Activities Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                    <Activity className="w-8 h-8 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-primary-dark">Care Activities</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Medications */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <Pill className="w-5 h-5 text-blue-600 mr-2" />
                            <h3 className="font-semibold text-gray-800">Medications</h3>
                        </div>
                        {careActivities.medications.length === 0 ? (
                            <p className="text-sm text-gray-500">No medications</p>
                        ) : (
                            <div className="space-y-2">
                                {careActivities.medications.slice(0, 3).map((med, index) => (
                                    <div key={index} className="text-sm">
                                        <p className="font-medium text-gray-700">{med.name}</p>
                                        <p className="text-gray-500 text-xs">{med.dosage} - {med.frequency}</p>
                                    </div>
                                ))}
                                {careActivities.medications.length > 3 && (
                                    <p className="text-xs text-primary">+{careActivities.medications.length - 3} more</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Vital Signs */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <Heart className="w-5 h-5 text-red-600 mr-2" />
                            <h3 className="font-semibold text-gray-800">Vital Signs</h3>
                        </div>
                        {careActivities.vitalSigns.length === 0 ? (
                            <p className="text-sm text-gray-500">No vitals recorded</p>
                        ) : (
                            <div className="space-y-2">
                                {careActivities.vitalSigns.slice(0, 3).map((vital, index) => (
                                    <div key={index} className="text-sm">
                                        <p className="text-gray-600 text-xs">{formatDate(vital.recordedAt)}</p>
                                        <p className="text-gray-700">BP: {vital.bloodPressure}</p>
                                        <p className="text-gray-700">HR: {vital.heartRate} bpm</p>
                                    </div>
                                ))}
                                {careActivities.vitalSigns.length > 3 && (
                                    <p className="text-xs text-primary">+{careActivities.vitalSigns.length - 3} more</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Nutrition */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <Apple className="w-5 h-5 text-green-600 mr-2" />
                            <h3 className="font-semibold text-gray-800">Nutrition</h3>
                        </div>
                        {careActivities.nutritionLogs.length === 0 ? (
                            <p className="text-sm text-gray-500">No nutrition logs</p>
                        ) : (
                            <div className="space-y-2">
                                {careActivities.nutritionLogs.slice(0, 3).map((log, index) => (
                                    <div key={index} className="text-sm">
                                        <p className="text-gray-600 text-xs">{formatDate(log.recordedAt)}</p>
                                        <p className="text-gray-700">{log.mealType}</p>
                                        <p className="text-gray-500 text-xs">{log.calories} cal</p>
                                    </div>
                                ))}
                                {careActivities.nutritionLogs.length > 3 && (
                                    <p className="text-xs text-primary">+{careActivities.nutritionLogs.length - 3} more</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Exercise */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <Dumbbell className="w-5 h-5 text-purple-600 mr-2" />
                            <h3 className="font-semibold text-gray-800">Exercise</h3>
                        </div>
                        {careActivities.exerciseLogs.length === 0 ? (
                            <p className="text-sm text-gray-500">No exercise logs</p>
                        ) : (
                            <div className="space-y-2">
                                {careActivities.exerciseLogs.slice(0, 3).map((log, index) => (
                                    <div key={index} className="text-sm">
                                        <p className="text-gray-600 text-xs">{formatDate(log.recordedAt)}</p>
                                        <p className="text-gray-700">{log.exerciseType}</p>
                                        <p className="text-gray-500 text-xs">{log.duration} min - {log.intensity}</p>
                                    </div>
                                ))}
                                {careActivities.exerciseLogs.length > 3 && (
                                    <p className="text-xs text-primary">+{careActivities.exerciseLogs.length - 3} more</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
