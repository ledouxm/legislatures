"use client";

import EntityDetails from "./entityDetails"

import Chart from "../chart/chart";
import { CurrentType } from "../../types/current";
import { EventType } from "../../types/event";
import { RepublicType } from "../../types/republic";
import { FamilyType } from "../../types/family";
import { TooltipProvider } from "../utils/tooltipContext";
import { useState } from "react";
import PercentageButton from "./percentageButton";
import { useDetailsContext } from "../utils/detailsContext";

type Props = {
    republics: RepublicType[];
    currents: CurrentType[];
    events: EventType[];
}


export default function Main({republics, currents, events}: Props) {
    const [axisLeftPercentage, setAxisLeftPercentage] = useState(20);
    const { detailsContent } = useDetailsContext();
    const selectedEntity = detailsContent?.entity;

    return (
        <main 
            className="w-full max-w-screen-3xl mx-auto px-5 md:px-10 h-[calc(100vh-5.75rem)] md:h-[calc(100vh-10.5rem)]"
        >
            <div className="w-full h-full overflow-y-scroll no-scrollbar">
                <div className="flex gap-2">
                    <input
                        type="range"
                        name="axisLeft"
                        id="axisLeft"
                        min={5}
                        max={50}
                        value={axisLeftPercentage}
                        step={5}
                        onChange={(e) => setAxisLeftPercentage(Number(e.target.value))}
                    />
                    <PercentageButton percentage={axisLeftPercentage} deputies={axisLeftPercentage} totalDeputies={50} onHover={() => { } } isPercentage={false} />
                </div>

                {/* Chart */}
                {republics && currents && events && (
                    <TooltipProvider>
                        <Chart republics={republics} currents={currents} events={events} axisLeftPercentage={axisLeftPercentage} />
                    </TooltipProvider>
                )}
                
                {selectedEntity && (
                    <EntityDetails

                    />
                )}
            </div>
        </main>
    )
}