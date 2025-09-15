import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface MunicipalTeam {
  id: string;
  team_name: string;
  city_name: string;
  state_name: string;
  email: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
}

interface MunicipalSession {
  team: MunicipalTeam;
  loginTime: string;
}

interface MunicipalAuthContextType {
  session: MunicipalSession | null;
  loading: boolean;
  signOut: () => void;
}

const MunicipalAuthContext = createContext<MunicipalAuthContextType | undefined>(undefined);

export const MunicipalAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<MunicipalSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedSession = localStorage.getItem('municipal_session');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        // Check if session is still valid (less than 24 hours old)
        const loginTime = new Date(parsedSession.loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setSession(parsedSession);
        } else {
          localStorage.removeItem('municipal_session');
        }
      } catch (error) {
        localStorage.removeItem('municipal_session');
      }
    }
    setLoading(false);
  }, []);

  const signOut = () => {
    localStorage.removeItem('municipal_session');
    setSession(null);
  };

  return (
    <MunicipalAuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </MunicipalAuthContext.Provider>
  );
};

export const useMunicipalAuth = () => {
  const context = useContext(MunicipalAuthContext);
  if (context === undefined) {
    throw new Error('useMunicipalAuth must be used within a MunicipalAuthProvider');
  }
  return context;
};