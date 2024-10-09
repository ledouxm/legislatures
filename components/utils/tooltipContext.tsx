"use client";

import { createContext, useContext, useState } from "react";
import { PartyType } from "../../types/party";

interface TooltipContextType {
    tooltipParty: PartyType | null;
    setTooltipParty: (tooltipParty: PartyType | null) => void;
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
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
    const [tooltipParty, setTooltipParty] = useState(null);

    return (
        <TooltipContext.Provider value={{ tooltipParty, setTooltipParty }}>
            {children}
        </TooltipContext.Provider>
    )
};