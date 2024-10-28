import { motion } from "framer-motion";
import { EventType } from "../../types/event";

type Props = {
    event: EventType;
    axisLeftPosition: number;
    minHeight: number;
    firstLegislature: number;
}

export default function Event({event, axisLeftPosition, minHeight, firstLegislature}: Props) {
    const beginDate = new Date(event.begin).getFullYear();
    const endDate = new Date(event.end).getFullYear();

    const y = (beginDate - firstLegislature) * minHeight;
    const height = ((endDate - beginDate) * minHeight) || minHeight;

    const textStart = 8;

    const transitionDuration = 0.5;

    return (
        <motion.g 
            key={event.title} 
            clipPath={`url(#clip-${event.begin})`}
            initial={{ 
                y: y, 
                opacity: "0.1"
            }}
            animate={{ 
                y: y, 
                opacity: "1"
            }}
            transition={{ duration: transitionDuration }}
        >
            {/* Clip */}
            <defs>
                <clipPath id={`clip-${event.begin}`}>
                    <motion.rect 
                        x="0" 
                        y="0" 
                        width={axisLeftPosition} 
                        initial={{ height: height }}
                        animate={{ height: height }}
                        transition={{ duration: transitionDuration }}
                    />
                </clipPath>
            </defs>

            {/* Event rectangle */}
            <motion.rect
                x={0}
                y={0}
                width={axisLeftPosition}
                initial={{ height: height }}
                animate={{ height: height }}
                transition={{ duration: transitionDuration }}
                fill="black"
                fillOpacity={0.05}
            />

            {/* Event Date */}
            <text
                x={textStart}
                y={10.5}
                textAnchor="left"
                fill="currentColor"
                opacity={0.5}
                fontSize={10}
                className="translate-x-0 sm:translate-x-5"
            >
                {endDate !== beginDate ? `${beginDate} → ${endDate}` : beginDate}
            </text>

            {/* Event Title */}
            <text
                x={endDate !== beginDate
                    ? textStart
                    : textStart + 26.5
                }
                y={endDate !== beginDate
                    ? 21
                    : 10.5
                }
                textAnchor="left"
                fill="currentColor"
                fontSize={10}
                className="translate-x-0 sm:translate-x-5"
            >
                {event.title}
            </text>
        </motion.g>
    )    
}