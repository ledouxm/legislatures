"use client";

import PartyBar from "./partyBar";
import { LegislatureType } from "../../types/legislature";
import { ChartDimensions } from "../utils/useChartDimensions";
import { useTooltipContext } from "../utils/tooltipContext";

type LegislatureProps = {
    leg: LegislatureType;
    nextLeg: LegislatureType | null;
    minHeight: number;
    dimensions: ChartDimensions;
    firstLegislature: number;
}

export default function Legislature({ leg, nextLeg, minHeight, dimensions, firstLegislature }: LegislatureProps) {
    // Place the legislature on the y axis
    const y = (leg.legislature - firstLegislature) * minHeight;
    // Calculate the width of the graph
    const graphWidth = dimensions.boundedWidth * 0.8;

    // Calculate the start of the next legislature on the y axis
    const nextLegStart = nextLeg 
        ? (nextLeg.legislature - leg.legislature) * minHeight 
        : minHeight * 2;

    // Set the hovered party
    const { setTooltipContent } = useTooltipContext();

    return (
        <>
            <g
                key={leg.legislature}
                className={`legislature-${leg.legislature}`}
            >
                {leg.parties.map((party, i) => {
                    // Generate the width of the party with a percentage of the graph width
                    const partyWidth = graphWidth * (party.deputes / leg.total_deputes);
                    // Generate the height of the party from its duration and the minimum height
                    const height = nextLegStart / 2;
                    // Generate the x position of the party by summing the width of the previous parties
                    const partyX = i === 0 ? 0 : leg.parties.slice(0, i).reduce((accumulator, party) => accumulator + (graphWidth * (party.deputes / leg.total_deputes)), 0);
                    
                    // Check if the party is in a coalition, and if it's the first or last party of the coalition
                    const isInCoalition = party.coalition?.length > 1;
                    let coalitionBorder = {
                        first: false,
                        last: false,
                    }
                    if (isInCoalition) {
                        coalitionBorder.first = leg.parties[i - 1]?.coalition !== party.coalition;
                        coalitionBorder.last = leg.parties[i + 1]?.coalition !== party.coalition;
                    }

                    // Find the corresponding party in the next legislature
                    const nextParty = nextLeg
                        ? nextLeg.parties?.find(p => p.current.name === party.current.name)
                        : null;
                    // Generate the next party width
                    const nextPartyWidth = nextLeg
                        ? graphWidth * (nextParty?.deputes / nextLeg?.total_deputes)
                        : null;
                    // Generate the next party x position
                    const nextPartyX = nextParty
                        ? nextLeg.parties.slice(0, nextLeg.parties.indexOf(nextParty)).reduce((accumulator, party) => accumulator + (graphWidth * (party.deputes / nextLeg.total_deputes)), 0)
                        : null;

                    // Generate the polygon points
                    const polygonPoints = [
                        [partyX, y + height],
                        [partyX + partyWidth, y + height],
                        [nextPartyX + nextPartyWidth, y + (height * 2)],
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
                            className={`${leg.legislature}-${party.current?.name.toLowerCase().replace(/[^a-z]+/g, '')}`}
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
                            />
                            {/* Transition polygons */}
                            {nextParty && (
                                <polygon
                                    points={polygonPoints}
                                    fill={party.current.color}
                                    opacity={0.75}
                                    shapeRendering="crispEdges"
                                />
                            )}
                        </g>
                    )
                })}
            </g>

        </>
    )
}