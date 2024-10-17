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

type Props = {
    republics: RepublicType[];
    currents: CurrentType[];
    events: EventType[];
}


export default function Main({republics, currents, events}: Props) {
    const [axisLeftPercentage, setAxisLeftPercentage] = useState(20);
    const [selectedEntity, setSelectedEntity] = useState<CurrentType | null>(null);
    const [currentDescription, setCurrentDescription] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [currentWiki, setCurrentWiki] = useState<string | null>(null);

    return (
        <main 
            className="w-full max-w-screen-3xl mx-auto px-5 md:px-10"
            style={{ height: "calc(100vh - 10.5rem)" }}
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
                
                {/* {selectedEntity && (
                    <div className="w-full h-full flex justify-end items-end fixed top-0 left-0">
                        <div className="sticky bottom-4">
                                <EntityDetails
                                    entity={selectedEntity}
                                    description={currentDescription}
                                    image={currentImage}
                                    wiki={currentWiki}
                                    parent={null}
                                    onClick={() => {}}
                                    onClose={() => {setSelectedEntity(null)}}
                                />
                        </div>
                    </div>
                )} */}
            </div>
        </main>
    )
}