import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AppRole } from '@/types';
import { mockStore } from '@/services/mockDataStore';

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial check from mock store session
    const current = mockStore.getCurrentUser();
    if (current) {
      setUser(current);
      setSession({ user: current });
    }
    setLoading(false);

    // Listen for mock store updates
    const unsubscribe = mockStore.subscribe(() => {
      const updated = mockStore.getCurrentUser();
      setUser(updated);
      setSession(updated ? { user: updated } : null);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await mockStore.signIn(email, password);
    setLoading(false);
    if (result.error) {
      return { error: result.error };
    }
    setUser(result.user);
    setSession({ user: result.user });
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    const result = await mockStore.signUp(email, password, fullName);
    setLoading(false);
    if (!result.error) {
      const signInRes = await mockStore.signIn(email, password);
      if (signInRes.user) {
        setUser(signInRes.user);
        setSession({ user: signInRes.user });
      }
    }
    return result;
  };

  const signOut = async () => {
    await mockStore.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
