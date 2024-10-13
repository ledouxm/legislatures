"use client";

import { useEffect, useRef, useState } from "react";
import { TooltipContentType } from "../../types/tooltipContent";
import { useTooltipContext } from "../utils/tooltipContext";
import EntityButton from "./entityButton";
import Badge from "./badge";
import PercentageButton from "./percentageButton";

export default function Tooltip({ chartWidth, y, axisLeftPosition, xStart, xEnd, legislature, party }: TooltipContentType) {
    const { setTooltipContent } = useTooltipContext();
    const tooltipContent = { chartWidth, y, xStart, xEnd, legislature, party };

    // Get tooltip dimensions
    const tooltipRef = useRef(null);

    // Calculate the position of the tooltip
    const tooltipLeft = xStart + axisLeftPosition;

    useEffect(() => {
        if (tooltipRef.current) {
            // Calculate the minimum width of the tooltip from the size of the party
            const partyWidth = (xEnd - xStart);
            tooltipRef.current.style.minWidth = `${partyWidth}px`;

            // Top position
            const tooltipHeight = tooltipRef.current.clientHeight;
            // tooltipRef.current.style.top = `${(y - tooltipHeight) + 28}px`;
            if (y - tooltipHeight < 0) {
                tooltipRef.current.style.top = `${0}px`;
            } else {
                tooltipRef.current.style.top = `${y - tooltipHeight + 28}px`;
            }

            // Left position
            const tooltipWidth = tooltipRef.current.clientWidth;
            if (tooltipLeft + tooltipWidth > chartWidth) {
                tooltipRef.current.style.right = "1px";
                tooltipRef.current.style.left = "auto";
            } else {
                tooltipRef.current.style.left = `${tooltipLeft}px`;
                tooltipRef.current.style.right = "auto";
            }
        }
    }, [y, axisLeftPosition, xStart, xEnd, legislature, party, tooltipLeft, chartWidth]);

    // Find all the parties from the same coalition in the legislature
    const coalitionParties = party.coalition ? legislature.parties.filter(p => p.coalition === party.coalition) : [];
    // Calculate the total number of deputes in the coalition
    const coalitionTotalDeputies = party.coalition ? coalitionParties.reduce((accumulator, party) => accumulator + party.deputes, 0) : 0;
    // Get the most important party in the coalition
    const mostImportantParty = party.coalition ? coalitionParties.reduce((a, b) => a.deputes > b.deputes ? a : b) : null;

    // Calculate the party percentage and the coalition percentage
    const partyPercentage = party.deputes / legislature.total_deputes * 100;
    const coalitionPercentage = party.coalition ? coalitionTotalDeputies / legislature.total_deputes * 100 : 0;

    // On percentage button click, display number of deputies
    const [isPercentage, setIsPercentage] = useState(true);
    const handlePercentageClick = () => setIsPercentage(!isPercentage);

    return (
        <div
            ref={tooltipRef}
            className="absolute pb-2 flex justify-start transition-all duration-500"
            onMouseEnter={() => setTooltipContent(tooltipContent)}
        >
            <div
                className="p-2.5 rounded-xl flex flex-col gap-1.5 bg-white shadow-md z-50 border border-black/5"
            >
                {/* Year and current name */}
                <div className="flex gap-1.5 justify-start">
                    {legislature && 
                        <div className="py-1 px-2 rounded-full border border-black/20 border-dashed text-xs text-black/50 leading-none flex items-center">
                            {legislature.legislature}
                        </div>
                    }
                    {party.current && <Badge name={party.current.name} hex={(party.current.color)} />}
                </div>

                {/* Party name and percentage */}
                <div className="flex gap-1.5 justify-between">
                    <EntityButton entity={party} onClick={() => {}} isActive={true} />
                    <PercentageButton percentage={partyPercentage} deputies={party.deputes} totalDeputies={legislature.total_deputes} isPercentage={isPercentage} onHover={handlePercentageClick} />
                </div>

                {/* Coalition name and percentage */}
                {party.coalition && 
                    <div className="flex gap-2 justify-between">
                        <div className="flex gap-1.5 items-center leading-none">
                            <span className="text-black/35 pl-0.5">
                                Coalition
                            </span>
                            <div className="flex gap-1 items-center">
                                <span className="size-2 rounded-full inline-block" style={{ backgroundColor: mostImportantParty.current.color }}></span>
                                <span className="text-black/50">
                                    {party.coalition}
                                </span>
                            </div>
                        </div>
                        <PercentageButton percentage={coalitionPercentage} deputies={coalitionTotalDeputies} totalDeputies={legislature.total_deputes} isPercentage={isPercentage} onHover={handlePercentageClick} />
                    </div>
                }
            </div>
        </div>
    );
}