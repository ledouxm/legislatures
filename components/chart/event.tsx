export default function Event({event, axisLeftPosition, minHeight, firstLegislature}) {
    const beginDate = new Date(event.begin).getFullYear();
    const endDate = new Date(event.end).getFullYear();
    
    // if axisLeftPosition is 50 or less opacity is 0, if axisLeftPosition is minWidth opacity is 1, between 0 and minWidth opacity is linear
    const minWidth = 150;
    const opacity = Math.min(1, Math.max(0, (axisLeftPosition - 50) / (minWidth - 50)));


    return (
        <g 
            key={event.title} 
            transform={`translate(0, ${(beginDate - firstLegislature) * minHeight})`}
            opacity={opacity}
            clipPath="url(#clip)"
        >
            {/* Clip */}
            <defs>
                <clipPath id="clip">
                    <rect 
                        x="0" 
                        y="0" 
                        width={axisLeftPosition} 
                        height="100%" 
                    />
                </clipPath>
            </defs>

            {/* Event rectangle */}
            <rect
                x={0}
                y={0}
                width={axisLeftPosition}
                height={((endDate - beginDate) * minHeight) || minHeight}
                fill="#F2F2F2"
            />

            {/* Event Date */}
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

            {/* Event Title */}
            <text
                x={endDate !== beginDate
                    ? 4
                    : 32
                }
                y={endDate !== beginDate
                    ? 20
                    : 9
                }
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