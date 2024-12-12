"use client";

import { createContext, useContext, useState } from "react";
import { TooltipContentType } from "../../../types/tooltipContent";

interface TooltipContextType {
  tooltipContent: TooltipContentType | null;
  setTooltipContent: ({
    xStart,
    xEnd,
    legislature,
    party,
    coalitionDatas
  }: TooltipContentType) => void;
}

// Create context for tooltip
const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

// Create a hook to use the tooltip context
export const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltipContext must be used within a TooltipProvider");
  }
  return context;
};

// Create a provider for the tooltip context
export const TooltipProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [tooltipContent, setTooltipContent] = useState(null);

  return (
    <TooltipContext.Provider value={{ tooltipContent, setTooltipContent }}>
      {children}
    </TooltipContext.Provider>
  );
};
