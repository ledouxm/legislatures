export default function Event({event, axisLeftPosition, minHeight, firstLegislature}) {
    const beginDate = new Date(event.begin).getFullYear();
    const endDate = new Date(event.end).getFullYear();
    return (
        <g 
            key={event.title} 
            transform={`translate(0, ${(beginDate - firstLegislature) * minHeight})`}
            opacity={0}
        >
            <rect
                x={0}
                y={0}
                width={axisLeftPosition}
                height={((endDate - beginDate) * minHeight) || minHeight}
                fill="#F2F2F2"
            />
            <text
                x={4}
                y={9}
                dominantBaseline="middle"
                textAnchor="left"
                fill="currentColor"
                opacity={0.5}
                fontSize={10}
                width={axisLeftPosition}
            >
                {endDate !== beginDate ? `${beginDate} → ${endDate}` : beginDate}
            </text>
            <text
                x={4}
                y={20}
                dominantBaseline="middle"
                textAnchor="left"
                fill="currentColor"
                fontSize={10}
                width={axisLeftPosition}
            >
                {event.title}
            </text>
        </g>
    )    
}