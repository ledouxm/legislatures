"use client";

import EntityDetails from "./entityDetails"

import Chart from "../chart/chart";
import { CurrentType } from "../../types/current";
import { EventType } from "../../types/event";
import { RepublicType } from "../../types/republic";
import { TooltipProvider } from "../utils/tooltipContext";
import { useEffect, useRef, useState } from "react";
import { useDetailsContext } from "../utils/detailsContext";

type Props = {
    republics: RepublicType[];
    currents: CurrentType[];
    events: EventType[];
    settingsVisibility: boolean;
    setSettingsVisibility: () => void;
}


export default function Main({republics, currents, events, settingsVisibility, setSettingsVisibility}: Props) {
    const [axisLeftPercentage, setAxisLeftPercentage] = useState(30);
    const { detailsContent } = useDetailsContext();
    const selectedEntity = detailsContent?.entity;

    // Close the settings when the user clicks outside
    const settingsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setSettingsVisibility();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [settingsRef, setSettingsVisibility]);

    return (
        <main 
            className="relative w-full max-w-screen-3xl mx-auto h-[calc(100dvh-6.5rem)]"
        >
            <div className="w-full h-full overflow-y-scroll no-scrollbar">
                {/* Chart */}
                {republics && currents && events && (
                    <TooltipProvider>
                        <Chart 
                            republics={republics} 
                            currents={currents} 
                            events={events} 
                            axisLeftPercentage={axisLeftPercentage} 
                        />
                    </TooltipProvider>
                )}
                
                {selectedEntity && (
                    <EntityDetails/>
                )}
            </div>
        </main>
    )
}