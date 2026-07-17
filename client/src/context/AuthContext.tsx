import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

interface User {
  _id: string;

  bloodBridgeId: string;

  name: string;
  email: string;

  phone?: string;

  bloodGroup?: string;

  dateOfBirth?: string;

  gender?: string;

  weight?: number;

  city?: string;

  availabilityStatus?:
    | "Available"
    | "Busy"
    | "Unavailable";

  totalDonations: number;

  lastDonationDate?: string;

  nextEligibleDonationDate?: string;

  role: "user" | "admin";

  isProfileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;

  refreshUser: (
    user: User
  ) => void;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const storedToken =
      localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user");

    if (storedToken && storedUser) {

      setToken(storedToken);

      setUser(JSON.parse(storedUser));

    }

    setLoading(false);

  }, []);

  const login = (
    token: string,
    user: User
  ) => {

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);

  };

  const refreshUser = (
    updatedUser: User
  ) => {

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

  };

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};