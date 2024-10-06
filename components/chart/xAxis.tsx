import { useMemo } from "react";
import * as d3 from "d3";

// Inspired by https://2019.wattenberger.com/blog/react-and-d3

interface Props {
    domain?: [number, number];
    range?: [number, number];
    axisLeftPosition?: number;
    axisTopPosition?: number;
    axisHeight?: number;
}

export default function XAxis({
    domain = [0, 100],
    range = [0, 300],
    axisLeftPosition = 0,
    axisTopPosition = 0,
    axisHeight = 24
}: Props) {
    const tickSize = 6;
    const tickTop = axisHeight - tickSize - 0.5; // 0.5 is half of the stroke width

    const ticks = useMemo(() => {
        const adjustedRange = [axisLeftPosition!, range[1]];
        const xScale = d3.scaleLinear()
            .domain(domain)
            .range(adjustedRange);
        
        const customTicks = [25, 50, 75];

        return customTicks.map(value => ({
            value,
            xOffset: xScale(value)
        }));
    }, [domain, range, axisLeftPosition]);

    return (
        <>
            <path
                d={[
                    "M", axisLeftPosition, tickTop,
                    "v", tickSize,
                    "H", range[1],
                    "v", -tickSize,
                ].join(" ")}
                fill="none"
                stroke="currentColor"
            />
            {ticks.map(({ value, xOffset }) => (
                <g
                    key={value}
                    transform={`translate(${xOffset}, 0)`}
                >
                    <line
                        y1={tickTop}
                        y2={axisHeight}
                        stroke="currentColor"
                    />
                    <text
                        key={value}
                        style={{
                            fontSize: "10px",
                            textAnchor: "middle",
                            transform: `translate(2px , ${axisHeight * 0.65}px)`
                        }}
                    >
                        {value}&#8239;%
                    </text>
                </g>
            ))}     
        </>
    )
}