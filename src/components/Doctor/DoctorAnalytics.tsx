import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { BarChart3, TrendingUp, Users, AlertCircle } from 'lucide-react';

interface Analytics {
    totalPatients: number;
    riskDistribution: {
        green: number;
        yellow: number;
        orange: number;
        maroon: number;
        red: number;
    };
    highRiskPatientCount: number;
    assessmentCounts: {
        gad7: number;
        phq9: number;
        cvd: number;
    };
}

export function DoctorAnalytics() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const data = await api.getDoctorAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Unable to load analytics data.</p>
            </div>
        );
    }

    const totalAssessments = analytics.riskDistribution.green +
        analytics.riskDistribution.yellow +
        analytics.riskDistribution.orange +
        analytics.riskDistribution.maroon +
        analytics.riskDistribution.red;

    const getPercentage = (count: number) => {
        return totalAssessments > 0 ? ((count / totalAssessments) * 100).toFixed(1) : '0';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <BarChart3 className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-primary-dark">Analytics Dashboard</h2>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Patients</p>
                            <p className="text-3xl font-bold text-gray-800">{analytics.totalPatients}</p>
                        </div>
                        <Users className="w-12 h-12 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">High Risk Patients</p>
                            <p className="text-3xl font-bold text-red-600">{analytics.highRiskPatientCount}</p>
                        </div>
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Assessments</p>
                            <p className="text-3xl font-bold text-gray-800">{totalAssessments}</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Completion Rate</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {analytics.totalPatients > 0
                                    ? ((totalAssessments / (analytics.totalPatients * 3)) * 100).toFixed(0)
                                    : '0'}%
                            </p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Risk Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">Low Risk (Green)</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">
                                {analytics.riskDistribution.green} ({getPercentage(analytics.riskDistribution.green)}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getPercentage(analytics.riskDistribution.green)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">Mild Risk (Yellow)</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">
                                {analytics.riskDistribution.yellow} ({getPercentage(analytics.riskDistribution.yellow)}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getPercentage(analytics.riskDistribution.yellow)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">Moderate Risk (Orange)</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">
                                {analytics.riskDistribution.orange} ({getPercentage(analytics.riskDistribution.orange)}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getPercentage(analytics.riskDistribution.orange)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full bg-red-700 mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">Moderately Severe (Maroon)</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">
                                {analytics.riskDistribution.maroon} ({getPercentage(analytics.riskDistribution.maroon)}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-red-700 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getPercentage(analytics.riskDistribution.maroon)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">Severe Risk (Red)</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">
                                {analytics.riskDistribution.red} ({getPercentage(analytics.riskDistribution.red)}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getPercentage(analytics.riskDistribution.red)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assessment Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">GAD-7 (Anxiety)</p>
                        <p className="text-2xl font-bold text-blue-600">{analytics.assessmentCounts.gad7}</p>
                        <p className="text-xs text-gray-500">completed assessments</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">PHQ-9 (Depression)</p>
                        <p className="text-2xl font-bold text-purple-600">{analytics.assessmentCounts.phq9}</p>
                        <p className="text-xs text-gray-500">completed assessments</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">CVD Risk</p>
                        <p className="text-2xl font-bold text-red-600">{analytics.assessmentCounts.cvd}</p>
                        <p className="text-xs text-gray-500">completed assessments</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
