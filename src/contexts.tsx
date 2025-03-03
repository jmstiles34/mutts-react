import { createContext, useContext, useState, type ReactNode } from "react";

// Define the session type
interface Session {
  name: string;
  email: string;
}

// Define the context type
interface SessionContextType {
  session: Session;
  updateSession: (newSession: Partial<Session>) => void;
  resetSession: () => void;
}

// Provider component props
interface SessionProviderProps {
  children: ReactNode;
}

// Create the context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider component
export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [session, setSession] = useState<Session>({ name: "", email: "" });

  // Function to update session values
  const updateSession = (newSession: Partial<Session>) => {
    setSession((prevSession) => ({ ...prevSession, ...newSession }));
  };

  // Function to reset session values
  const resetSession = () => {
    setSession({ name: "", email: "" });
  };

  return (
    <SessionContext.Provider value={{ session, updateSession, resetSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use the session context
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
