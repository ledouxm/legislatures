import { useMemo } from "react";
import * as d3 from "d3";
import { LegislatureType } from "../../types/legislature";

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
        <>
            {/* The axis line */}
            <path
                d={[
                    "M", axisLeftPosition, 0,    // Start at {axisLeftPosition}% on the x axis and {axisTopPosition}px on the y axis
                    "v", 6,                                 // First tick
                    "V", ticks[ticks.length - 1].yOffset,                          // Move to the bottom of the y axis
                    "v", -6                                 // Last tick
                ].join(" ")}
                fill="none"
                stroke="currentColor"
            />

            {/* Y axis ticks */}
            {ticks.map(({ value, yOffset }) => (
                <g
                    key={value}
                    transform={`translate(${axisLeftPosition}, ${yOffset})`}
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
                </g>
            ))}
        </>
    )
}