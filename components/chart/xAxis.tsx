import { scaleLinear } from "d3";
import { useMemo } from "react";

// Inspired by https://2019.wattenberger.com/blog/react-and-d3

interface Props {
  domain?: [number, number];
  range?: [number, number];
  axisLeftPosition?: number;
  axisHeight?: number;
  axisRevert?: boolean;
}

export default function XAxis({
  domain = [0, 100],
  range = [0, 300],
  axisLeftPosition = 0,
  axisHeight = 28,
  axisRevert = false
}: Props) {
  const tickSize = 6;
  const tickTop = axisRevert ? tickSize + 0.5 : axisHeight - tickSize - 0.5; // 0.5 is half of the stroke width

  const ticks = useMemo(() => {
    const adjustedRange = [axisLeftPosition!, range[1]];
    const xScale = scaleLinear().domain(domain).range(adjustedRange);

    const customTicks = [25, 50, 75];

    return customTicks.map((value) => ({
      value,
      xOffset: xScale(value)
    }));
  }, [domain, range, axisLeftPosition]);

  return (
    <>
      {/* Line */}
      <path
        d={
          axisRevert
            ? [
                // Bottom axis
                "M",
                axisLeftPosition,
                tickTop, // Bottom left
                "v",
                -tickSize, // Up
                "H",
                range[1], // Right
                "v",
                tickSize // Down
              ].join(" ")
            : [
                // Top axis
                "M",
                axisLeftPosition,
                tickTop, // Top left
                "v",
                tickSize, // Down
                "H",
                range[1], // Right
                "v",
                -tickSize // Up
              ].join(" ")
        }
        fill="none"
        stroke="currentColor"
      />

      {/* Ticks */}
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${xOffset}, 0)`}
        >
          <line
            y1={tickTop}
            y2={axisRevert ? tickTop - tickSize : axisHeight}
            stroke="currentColor"
          />
          <text
            aria-hidden
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
  );
}
