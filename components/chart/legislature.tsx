"use client";

import PartyBar from "./partyBar";
import { LegislatureType } from "../../types/legislature";
import { ChartDimensions } from "../utils/useChartDimensions";
import { useTooltipContext } from "../utils/tooltipContext";
import { useVisibleCurrentsContext } from "../utils/currentsContext";
import { CurrentType } from "../../types/current";
import { motion } from "framer-motion";

type LegislatureProps = {
    leg: LegislatureType;
    nextLeg: LegislatureType | null;
    minHeight: number;
    dimensions: ChartDimensions;
    firstLegislature: number;
    axisLeftPercentage: number;
}

export default function Legislature({ leg, nextLeg, minHeight, dimensions, firstLegislature, axisLeftPercentage }: LegislatureProps) {
    // Place the legislature on the y axis
    const y = (leg.legislature - firstLegislature) * minHeight;

    // Calculate the width of the graph from the bounded width and the axis left position percentage
    const graphWidth = dimensions.boundedWidth * (1 - (axisLeftPercentage / 100));

    // Calculate the start of the next legislature on the y axis
    const nextLegStart = nextLeg 
        ? (nextLeg.legislature - leg.legislature) * minHeight 
        : minHeight * 2;

    // Get the filtered total deputies
    const { visibleCurrents }: { visibleCurrents: CurrentType[] } = useVisibleCurrentsContext();
    const filteredTotalDeputies = leg.parties.reduce((accumulator, party) => {
        if (visibleCurrents.find(current => current.parties.find(p => p.name === party.name))) {
            return accumulator + party.deputes;
        } else {
            return accumulator;
        }
    }, 0);
    // Same for the next legislature
    const filteredNextTotalDeputies = nextLeg
        ? nextLeg.parties.reduce((accumulator, party) => {
            if (visibleCurrents.find(current => current.parties.find(p => p.name === party.name))) {
                return accumulator + party.deputes;
            } else {
                return accumulator;
            }
        }, 0)
        : null;

    // Set the hovered party
    const { setTooltipContent } = useTooltipContext();

    // Set the transition duration
    const transitionDuration = 0.5;

    return (
        <>
            <g
                key={leg.legislature}
                className={`legislature-${leg.legislature}`}
            >
                {leg.parties.map((party, i) => {
                    // Find if the party is visible
                    const isVisible = visibleCurrents.find(current => current.parties.find(p => p.name === party.name));
                    // Generate the width of the party with a percentage of the graph width
                    const partyWidth = isVisible
                        ? (graphWidth * (party.deputes / filteredTotalDeputies)) || 0
                        : 0;
                    // Generate the height of the party from its duration and the minimum height
                    const height = nextLegStart / 2;
                    // Generate the x position of the party by summing the width of the previous parties
                    const partyX = i === 0 
                        ? 0 
                        : leg.parties.slice(0, i).reduce((accumulator, iteratedParty) => {
                            const isIteratedPartyVisible = visibleCurrents.find(current => current.parties.find(p => p.name === iteratedParty.name));
                            return isIteratedPartyVisible
                                ? (accumulator + (graphWidth * (iteratedParty.deputes / filteredTotalDeputies))) || 0
                                : accumulator;
                        }, 0);
                
                    // Check if the party is in a coalition, and if it's the first or last party of the coalition
                    const isInCoalition = party.coalition?.length > 1;
                    let coalitionBorder = {
                        first: false,
                        last: false,
                    }
                    if (isInCoalition) {
                        // Check if the previous visible party is in the same coalition
                        const previousVisibleParty = leg.parties.slice(0, i).reverse().find(p => visibleCurrents.find(current => current.parties.find(cp => cp.name === p.name)));
                        coalitionBorder.first = !previousVisibleParty || previousVisibleParty.coalition !== party.coalition;
                        // Check if the next visible party is in the same coalition
                        const nextVisibleParty = leg.parties.slice(i + 1).find(p => visibleCurrents.find(current => current.parties.find(cp => cp.name === p.name)));
                        coalitionBorder.last = !nextVisibleParty || nextVisibleParty.coalition !== party.coalition;
                    }

                    // Find the corresponding party in the next legislature
                    const nextParty = nextLeg
                        ? nextLeg.parties?.find(p => p.current.name === party.current.name)
                        : null;
                    // Find if the next party is visible
                    const nextPartyIsVisible = visibleCurrents.find(current => current.parties.find(p => p.name === nextParty?.name));
                    // Generate the next party width
                    const nextPartyWidth = nextLeg
                        ? nextPartyIsVisible
                            ? (graphWidth * (nextParty?.deputes / filteredNextTotalDeputies)) || 0
                            : 0
                        : null;
                    // Generate the next party x position
                    const nextPartyX = nextParty
                        ? nextLeg.parties.slice(0, nextLeg.parties.indexOf(nextParty)).reduce((accumulator, iteratedParty) => {
                            const isIteratedPartyVisible = visibleCurrents.find(current => current.parties.find(p => p.name === iteratedParty.name));
                            return isIteratedPartyVisible
                                ? (accumulator + (graphWidth * (iteratedParty.deputes / filteredNextTotalDeputies))) || 0
                                : accumulator;
                        }, 0)
                        : null;

                    // Generate the polygon points
                    const polygonPoints = [
                        [partyX, y + height],
                        [(partyX + partyWidth), y + height],
                        [(nextPartyX + nextPartyWidth), y + (height * 2)],
                        [nextPartyX, y + (height * 2)],
                    ].map(point => point.join(",")).join(" ");

                    // Create tooltip content
                    const tooltipContent = {
                        y : y,
                        xStart: partyX,
                        xEnd: partyX + partyWidth,
                        legislature: leg,
                        party,
                    }
                    
                    return (
                        <g
                            key={party.name}
                            className={`${leg.legislature}-${party.current?.name.toLowerCase().replace(/[^a-z]+/g, '')} ${party.deputes} ${partyWidth}`}
                            onMouseEnter={() => setTooltipContent(tooltipContent)}
                            onMouseLeave={() => setTooltipContent(null)}
                        >
                            {/* Parties */}
                            <PartyBar
                                party={party}
                                y={y}
                                height={height}
                                minHeight={minHeight}
                                partyWidth={partyWidth}
                                partyX={partyX}
                                coalitionBorder={coalitionBorder}
                                transitionDuration={transitionDuration}
                            />
                            
                            {/* Transition polygons */}
                            {nextParty && polygonPoints && (
                                <motion.polygon
                                    points={polygonPoints}
                                    fill={party.current.color}
                                    opacity={0.75}
                                    shapeRendering="crispEdges"
                                    initial={{ points: polygonPoints }}
                                    animate={{ points: polygonPoints }}
                                    transition={{ duration: transitionDuration }}
                                />
                            )}
                        </g>
                    )
                })}
            </g>

        </>
    )
}