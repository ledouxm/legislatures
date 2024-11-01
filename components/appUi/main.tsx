"use client";

import EntityDetails from "./entityDetails"

import Chart from "../chart/chart";
import { CurrentType } from "../../types/current";
import { EventType } from "../../types/event";
import { RepublicType } from "../../types/republic";
import { TooltipProvider } from "../utils/tooltipContext";
import { useDetailsContext } from "../utils/detailsContext";

type Props = {
    republics: RepublicType[];
    currents: CurrentType[];
    events: EventType[];
    eventsVisibility: boolean;
    referenceSize: number;
}


export default function Main({republics, currents, events, eventsVisibility, referenceSize}: Props) {
    const { detailsContent } = useDetailsContext();
    const selectedEntity = detailsContent?.entity;

    return (
        <main 
            className="relative w-full max-w-screen-3xl mx-auto h-[calc(100dvh-6.5rem)]"
        >
            <div className="w-full h-full overflow-y-scroll no-scrollbar overscroll-none">
                {/* Chart */}
                {republics && currents && events && (
                    <TooltipProvider>
                        <Chart 
                            republics={republics} 
                            currents={currents} 
                            events={events} 
                            eventsVisibility={eventsVisibility}
                            referenceSize={referenceSize}
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