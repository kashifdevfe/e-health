import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { AlertTriangle, Bell, CheckCircle, Clock, X } from 'lucide-react';

interface EmergencyAlert {
    id: string;
    patientId: string;
    alertType: string;
    severity: string;
    description: string;
    status: string;
    createdAt: string;
    acknowledgedAt?: string;
    resolvedAt?: string;
    patient: {
        id: string;
        fullName: string;
        email: string;
    };
}

interface EmergencyAlertsProps {
    userRole: 'doctor' | 'caregiver';
}

export function EmergencyAlerts({ userRole }: EmergencyAlertsProps) {
    const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('active');

    useEffect(() => {
        loadAlerts();
        // Poll for new alerts every 30 seconds
        const interval = setInterval(loadAlerts, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadAlerts = async () => {
        try {
            const data = await api.getEmergencyAlerts();
            setAlerts(data);
        } catch (error) {
            console.error('Error loading alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (alertId: string, status: string) => {
        try {
            await api.updateAlertStatus(alertId, status);
            loadAlerts();
        } catch (error) {
            console.error('Error updating alert:', error);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
            case 'high':
                return <AlertTriangle className="w-5 h-5" />;
            default:
                return <Bell className="w-5 h-5" />;
        }
    };

    const filteredAlerts = alerts.filter((alert) => {
        if (filter === 'all') return true;
        return alert.status === filter;
    });

    const activeCount = alerts.filter((a) => a.status === 'active').length;
    const acknowledgedCount = alerts.filter((a) => a.status === 'acknowledged').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Emergency Alerts</h3>
                    {activeCount > 0 && (
                        <span className="ml-3 px-2 py-1 bg-red-600 text-white rounded-full text-xs font-bold">
                            {activeCount} Active
                        </span>
                    )}
                </div>
                <button
                    onClick={loadAlerts}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                >
                    Refresh
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 border-b border-gray-200">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${filter === 'all'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    All ({alerts.length})
                </button>
                <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${filter === 'active'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Active ({activeCount})
                </button>
                <button
                    onClick={() => setFilter('acknowledged')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${filter === 'acknowledged'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Acknowledged ({acknowledgedCount})
                </button>
                <button
                    onClick={() => setFilter('resolved')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${filter === 'resolved'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Resolved
                </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
                {filteredAlerts.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                            {filter === 'active' ? 'No active alerts' : `No ${filter} alerts`}
                        </p>
                    </div>
                ) : (
                    filteredAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`border-2 rounded-lg p-4 ${getSeverityColor(alert.severity)} ${alert.status === 'active' ? 'shadow-lg' : 'shadow-sm'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h4 className="font-semibold text-gray-800">{alert.alertType}</h4>
                                            <span className="px-2 py-0.5 bg-white bg-opacity-50 rounded text-xs font-medium">
                                                {alert.severity.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                                            <div className="flex items-center">
                                                <span className="font-medium">Patient:</span>
                                                <span className="ml-1">{alert.patient.fullName}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                <span>{new Date(alert.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {alert.acknowledgedAt && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                Acknowledged: {new Date(alert.acknowledgedAt).toLocaleString()}
                                            </p>
                                        )}
                                        {alert.resolvedAt && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                Resolved: {new Date(alert.resolvedAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col space-y-2 ml-4">
                                    {alert.status === 'active' && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(alert.id, 'acknowledged')}
                                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition flex items-center"
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Acknowledge
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition flex items-center"
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Resolve
                                            </button>
                                        </>
                                    )}
                                    {alert.status === 'acknowledged' && (
                                        <button
                                            onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition flex items-center"
                                        >
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Resolve
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
