import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';
import { Profile } from '../types/database';

interface AuthContextType {
  user: Profile | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role: 'patient' | 'doctor' | 'caregiver') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { user: userData } = await api.getCurrentUser();
      const profileData: Profile = {
        id: userData.id,
        full_name: userData.fullName,
        user_role: userData.userRole as 'patient' | 'doctor' | 'caregiver',
        created_at: userData.createdAt,
        updated_at: userData.updatedAt,
      };
      setUser(profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: userData } = await api.login(email, password);
      const profileData: Profile = {
        id: userData.id,
        full_name: userData.fullName,
        user_role: userData.userRole as 'patient' | 'doctor' | 'caregiver',
        created_at: userData.createdAt,
        updated_at: userData.updatedAt,
      };
      setUser(profileData);
      setProfile(profileData);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'patient' | 'doctor' | 'caregiver') => {
    try {
      const { user: userData } = await api.register(email, password, fullName, role);
      const profileData: Profile = {
        id: userData.id,
        full_name: userData.fullName,
        user_role: userData.userRole as 'patient' | 'doctor' | 'caregiver',
        created_at: userData.createdAt,
        updated_at: userData.updatedAt,
      };
      setUser(profileData);
      setProfile(profileData);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await api.logout();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
