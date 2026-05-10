import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { authApi, AuthUser } from "../services/api";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch the extra user data from Firestore
          const { user: appUser } = await authApi.me();
          setUser(appUser);
          localStorage.setItem("token", await firebaseUser.getIdToken());
        } catch (error) {
          console.error("Failed to fetch user doc:", error);
          setUser(null);
          localStorage.removeItem("token");
        }
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  function login(token: string, user: AuthUser) {
    localStorage.setItem("token", token);
    setUser(user);
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("token");
    setUser(null);
  }

  const contextValue = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
