import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { FileText, Plus, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface TreatmentPlan {
    id: string;
    title: string;
    description: string;
    goals: string;
    medications?: string;
    exercises?: string;
    dietPlan?: string;
    startDate: string;
    endDate?: string;
    status: string;
    createdAt: string;
    doctor: {
        id: string;
        fullName: string;
    };
}

interface TreatmentPlansProps {
    patientId: string;
    patientName: string;
}

export function TreatmentPlans({ patientId, patientName }: TreatmentPlansProps) {
    const [plans, setPlans] = useState<TreatmentPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goals: '',
        medications: '',
        exercises: '',
        dietPlan: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
    });

    useEffect(() => {
        loadPlans();
    }, [patientId]);

    const loadPlans = async () => {
        try {
            const data = await api.getTreatmentPlans(patientId);
            setPlans(data);
        } catch (error) {
            console.error('Error loading treatment plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createTreatmentPlan({
                patientId,
                ...formData,
            });
            setShowForm(false);
            setFormData({
                title: '',
                description: '',
                goals: '',
                medications: '',
                exercises: '',
                dietPlan: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
            });
            loadPlans();
        } catch (error) {
            console.error('Error creating treatment plan:', error);
        }
    };

    const handleStatusUpdate = async (planId: string, newStatus: string) => {
        try {
            await api.updateTreatmentPlan(planId, { status: newStatus });
            loadPlans();
        } catch (error) {
            console.error('Error updating treatment plan:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <FileText className="w-6 h-6 text-primary mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Treatment Plans for {patientName}</h3>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {showForm ? 'Cancel' : 'New Plan'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g., Anxiety Management Plan"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Describe the treatment plan..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Goals *</label>
                            <textarea
                                required
                                value={formData.goals}
                                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="List treatment goals..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Medications (Optional)</label>
                            <textarea
                                value={formData.medications}
                                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="List prescribed medications..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Exercises (Optional)</label>
                            <textarea
                                value={formData.exercises}
                                onChange={(e) => setFormData({ ...formData, exercises: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Recommended exercises..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Diet Plan (Optional)</label>
                            <textarea
                                value={formData.dietPlan}
                                onChange={(e) => setFormData({ ...formData, dietPlan: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Dietary recommendations..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
                    >
                        Create Treatment Plan
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {plans.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No treatment plans created yet.</p>
                    </div>
                ) : (
                    plans.map((plan) => (
                        <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">{plan.title}</h4>
                                    <p className="text-sm text-gray-500">
                                        Created by Dr. {plan.doctor.fullName} on {new Date(plan.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {plan.status === 'active' && (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            Active
                                        </span>
                                    )}
                                    {plan.status === 'completed' && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            Completed
                                        </span>
                                    )}
                                    {plan.status === 'cancelled' && (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                            Cancelled
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Description:</p>
                                    <p className="text-sm text-gray-600">{plan.description}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700">Goals:</p>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{plan.goals}</p>
                                </div>

                                {plan.medications && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Medications:</p>
                                        <p className="text-sm text-gray-600 whitespace-pre-line">{plan.medications}</p>
                                    </div>
                                )}

                                {plan.exercises && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Exercises:</p>
                                        <p className="text-sm text-gray-600 whitespace-pre-line">{plan.exercises}</p>
                                    </div>
                                )}

                                {plan.dietPlan && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Diet Plan:</p>
                                        <p className="text-sm text-gray-600 whitespace-pre-line">{plan.dietPlan}</p>
                                    </div>
                                )}

                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>
                                        {new Date(plan.startDate).toLocaleDateString()}
                                        {plan.endDate && ` - ${new Date(plan.endDate).toLocaleDateString()}`}
                                    </span>
                                </div>
                            </div>

                            {plan.status === 'active' && (
                                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                                    <button
                                        onClick={() => handleStatusUpdate(plan.id, 'completed')}
                                        className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Mark Complete
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(plan.id, 'cancelled')}
                                        className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                                    >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Cancel Plan
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
