import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mboa_flix_demo_user';

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored) {
          const parsed = JSON.parse(stored) as AuthUser;

          if (parsed?.email && parsed?.name) {
            setUser(parsed);
          }
        }
      } catch (error) {
        console.warn('Unable to restore MBOA FLIX demo session.', error);
      } finally {
        setIsReady(true);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (nextUser: AuthUser) => {
    setUser(nextUser);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextUser)
      );
    } catch (error) {
      console.warn('Unable to persist MBOA FLIX demo session.', error);
    }
  };

  const signOut = async () => {
    setUser(null);

    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to clear MBOA FLIX demo session.', error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      signIn,
      signOut,
    }),
    [user, isReady]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
