import { PartyType } from "../../types/party";
import PartyBar from "./partyBar";

export default function Legislature({leg, nextLeg, minHeight, dimensions, firstLegislature}) {
    const y = (leg.legislature - firstLegislature) * minHeight;
    const graphWidth = dimensions.boundedWidth * 0.8;

    const nextLegStart = nextLeg 
        ? (nextLeg.legislature - leg.legislature) * minHeight 
        : minHeight * 2;

    return (
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
                
                return (
                    <g
                        key={party.name}
                        className={`${leg.legislature}-${party.current?.name.toLowerCase().replace(/[^a-z]+/g, '')}`}
                    >
                        {/* Parties */}
                        <PartyBar
                            party={party}
                            y={y}
                            height={height}
                            minHeight={minHeight}
                            partyWidth={partyWidth}
                            partyX={partyX}
                        />
                        {/* Polygons */}
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
    )
}