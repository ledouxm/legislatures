"use client";

import { createContext, useContext, useState } from "react";

interface TransitionsContextType {
    transitionsVisibility: boolean;
    setTransitionsVisibility: (transitionsVisibility: boolean) => void;
}

// Create context for Transitions
const TransitionsContext = createContext<TransitionsContextType | undefined>(undefined);

// Create a hook to use the transitions context
export const useTransitionsContext = () => {
    const context = useContext(TransitionsContext);
    if (!context) {
        throw new Error("useTransitionsContext must be used within a TransitionsProvider");
    }
    return context;
};

// Create a provider for the transitions context
export const TransitionsProvider = ({ children }: { children: React.ReactNode }) => {
    const [transitionsVisibility, setTransitionsVisibility] = useState(true);

    return (
        <TransitionsContext.Provider value={{ transitionsVisibility, setTransitionsVisibility }}>
            {children}
        </TransitionsContext.Provider>
    )
};