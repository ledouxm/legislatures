"use client";

import { createContext, useContext, useState } from "react";
import { DetailsContentType } from "../../../types/detailsContent";

interface DetailsContextType {
  detailsContent: DetailsContentType | null;
  setDetailsContent: ({ entity, parent }: DetailsContentType) => void;
}

// Create context for details
const DetailsContext = createContext<DetailsContextType | undefined>(undefined);

// Create a hook to use the details context
export const useDetailsContext = () => {
  const context = useContext(DetailsContext);
  if (!context) {
    throw new Error("useDetailsContext must be used within a DetailsProvider");
  }
  return context;
};

// Create a provider for the details context
export const DetailsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [detailsContent, setDetailsContent] = useState(null);

  return (
    <DetailsContext.Provider value={{ detailsContent, setDetailsContent }}>
      {children}
    </DetailsContext.Provider>
  );
};
