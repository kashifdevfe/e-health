import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { PatientDashboard } from './components/Patient/PatientDashboard';
import { DoctorDashboard } from './components/Doctor/DoctorDashboard';
import { CaregiverDashboard } from './components/Caregiver/CaregiverDashboard';

function AuthWrapper() {
  const { user, profile, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft to-primary-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft to-primary-light flex items-center justify-center p-4">
        {showLogin ? (
          <LoginForm onToggleForm={() => setShowLogin(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  if (profile.user_role === 'patient') {
    return <PatientDashboard />;
  }

  if (profile.user_role === 'doctor') {
    return <DoctorDashboard />;
  }

  if (profile.user_role === 'caregiver') {
    return <CaregiverDashboard />;
  }

  return (
    <div className="min-h-screen bg-primary-soft flex items-center justify-center">
      <p className="text-gray-600">Unknown user role</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;
