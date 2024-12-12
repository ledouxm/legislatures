"use client";

import { createContext, useContext, useState } from "react";

interface CoalitionsContextType {
  coalitionsVisibility: boolean;
  setCoalitionsVisibility: (coalitionsVisibility: boolean) => void;
}

// Create context for Coalitions
const CoalitionsContext = createContext<CoalitionsContextType | undefined>(
  undefined
);

// Create a hook to use the coalitions context
export const useCoalitionsContext = () => {
  const context = useContext(CoalitionsContext);
  if (!context) {
    throw new Error(
      "useCoalitionsContext must be used within a CoalitionsProvider"
    );
  }
  return context;
};

// Create a provider for the coalitions context
export const CoalitionsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [coalitionsVisibility, setCoalitionsVisibility] = useState(false);

  return (
    <CoalitionsContext.Provider
      value={{ coalitionsVisibility, setCoalitionsVisibility }}
    >
      {children}
    </CoalitionsContext.Provider>
  );
};
