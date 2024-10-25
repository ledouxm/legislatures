import { useMemo } from "react";
import * as d3 from "d3";
import { LegislatureType } from "../../types/legislature";
import { motion } from "framer-motion";

// Inspired by https://2019.wattenberger.com/blog/react-and-d3

interface Props {
    domain?: [number, number];
    range?: [number, number];
    frameWidth?: number;
    axisLeftPosition?: number;
    axisTopPosition?: number;
    legislatures: LegislatureType[];
}

export default function YAxis({
    domain = [1792, 2024],
    range = [0, 300],
    frameWidth = 300,
    axisLeftPosition = 0,
    axisTopPosition = 0,
    legislatures
}: Props) {    
    const ticks = useMemo(() => {
        const yScale = d3.scaleLinear()
            .domain(domain)
            .range(range);

        const customTicks = legislatures.map(leg => leg.legislature);

        return customTicks.map(value => ({
            value,
            yOffset: yScale(value)
        }));
    }, [domain, legislatures, range]);

    return (
        <g className="y-axis">
            {/* The axis line */}
            <path
                d={[
                    "M", axisLeftPosition, 0,    // Start at {axisLeftPosition}% on the x axis and {axisTopPosition}px on the y axis
                    "v", 6,                      // First tick
                    "V", ticks[ticks.length - 1].yOffset + 28,  // Move to the bottom of the y axis
                    "v", -6                      // Last tick
                ].join(" ")}
                fill="none"
                stroke="currentColor"
            />

            {/* Y axis ticks */}
            <g
                className="y-axis-ticks"
                transform={`translate(${axisLeftPosition}, 0)`}
            >
                {ticks.map(({ value, yOffset }) => (
                    <motion.g
                        key={value}
                        animate={{ y: yOffset }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Tick line */}
                        <line
                            x1="-6"
                            x2="0"
                            stroke="currentColor"
                        />
                        {/* Tick text */}
                        <text
                            style={{
                                fontSize: "10px",
                                textAnchor: "middle",
                                transform: "translate(-20px, 10px)"
                            }}
                        >
                            {value}
                        </text>
                    </motion.g>
                ))}
            </g>
        </g>
    )
}