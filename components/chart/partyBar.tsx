export default function PartyBar({ party, y, height, minHeight, partyWidth, partyX }) {
    const displayDeputies = height > (minHeight / 2);

    return (
        <g 
            key={party.name} 
            className={`party-${party.name.toLowerCase().replace(/[^a-z]+/g, '')} current-${party.current?.name.toLowerCase().replace(/[^a-z]+/g, '')}`}
            transform={`translate(${partyX},${y})`}
        >
            <rect
                x={0}
                y={0}
                width={partyWidth}
                height={height}
                fill={party.current.color}
                shapeRendering="crispEdges"
            />
            <text
                x={4}
                y={10}
                textAnchor="left"
                fill="currentColor"
                fontSize={10}
            >
                {party.name}
            </text>
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
        </g>
    )
}