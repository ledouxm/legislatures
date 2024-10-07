import { PartyType } from "../../types/party";

type PartyBarProps = {
    party: PartyType;
    y: number;
    height: number;
    minHeight: number;
    partyWidth: number;
    partyX: number;
    coalitionBorder: {
        first: boolean;
        last: boolean;
    }
}

export default function PartyBar({ party, y, height, minHeight, partyWidth, partyX, coalitionBorder }: PartyBarProps) {
    // Display text if the party is wide enough
    const displayText = partyWidth > 30;

    // Display deputies if the party is tall enough
    const displayDeputies = height > (minHeight / 2);

    const coalitionStrokeWidth = 0.5;

    return (
        <g 
            key={party.name} 
            className={`party-${party.name.toLowerCase().replace(/[^a-z]+/g, '')} current-${party.current?.name.toLowerCase().replace(/[^a-z]+/g, '')}`}
            transform={`translate(${partyX},${y})`}
        >
            {/* Current rectangle with its current color */}
            <rect
                x={0}
                y={0}
                width={partyWidth}
                height={height}
                fill={party.current.color}
                shapeRendering="crispEdges"
            />

            {/* Text, if party is wide enough */}
            {displayText && 
                <>
                    {/* Party name */}
                    <text
                        x={4}
                        y={10}
                        textAnchor="left"
                        fill="currentColor"
                        fontSize={10}
                    >
                        {party.name}
                    </text>
                    
                    {/* Deputies number, if legislature is long enough */}
                    {displayDeputies &&
                        <text
                            x={4}
                            y={20}
                            textAnchor="left"
                            fill="currentColor"
                            opacity={0.5}
                            fontSize={10}
                        >
                            {party.deputes}
                        </text>
                    }
                </>
            }

            {/* Coalition borders, if the party is in a coalition */}
            {party.coalition && 
                <>
                    {/* Top border */}
                    <line
                        x1={0}
                        y1={0}
                        x2={partyWidth}
                        y2={0}
                        stroke="currentColor"
                        strokeWidth={coalitionStrokeWidth}
                    />
                    {/* Bottom border */}
                    <line
                        x1={0}
                        y1={height - coalitionStrokeWidth}
                        x2={partyWidth}
                        y2={height - coalitionStrokeWidth}
                        stroke="currentColor"
                        strokeWidth={coalitionStrokeWidth}
                    />

                    {/* Left border, if first of coalition */}
                    {coalitionBorder.first &&
                        <line
                            x1={0}
                            y1={0}
                            x2={0}
                            y2={height - coalitionStrokeWidth}
                            stroke="currentColor"
                            strokeWidth={coalitionStrokeWidth}
                        />
                    }
                    
                    {/* Right border, if last of coalition */}
                    {coalitionBorder.last &&
                        <line
                            x1={partyWidth - coalitionStrokeWidth}
                            y1={0}
                            x2={partyWidth - coalitionStrokeWidth}
                            y2={height - coalitionStrokeWidth}
                            stroke="currentColor"
                            strokeWidth={coalitionStrokeWidth}
                        />
                    }
                </>
            }
        </g>
    )
}