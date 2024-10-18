import { CurrentType } from "../../types/current";
import { EventType } from "../../types/event";
import { FamilyType } from "../../types/family";
import { RepublicType } from "../../types/republic";
import Tooltip from "../appUi/tooltip";
import { useTooltipContext } from "../utils/tooltipContext";
import useChartDimensions from "../utils/useChartDimensions";
import Event from "./event";
import Republic from "./republic";
import XAxis from "./xAxis";
import YAxis from "./yAxis";
import * as d3 from "d3";

type Props = {
    republics: RepublicType[];
    currents: CurrentType[];
    events: EventType[];
    axisLeftPercentage: number;
}

export default function Chart({republics, currents, events, axisLeftPercentage}: Props) {
    // Set the dimensions of the chart by giving the margins
    const [ref, dimensions] = useChartDimensions({
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0
    })

    // Find the first and last legislature to calculate the total duration
    const firstLegislature = republics[0].legislatures[0].legislature;
    const lastLegislature = republics[republics.length - 1].legislatures[republics[republics.length - 1].legislatures.length - 1].legislature;
    const totalDuration = lastLegislature - firstLegislature;

    // Set the minimal height for a legislature (one year, in px)
    const minHeight = 28;
    // Calculate the height of the svg
    const svgHeight = minHeight * totalDuration + minHeight + dimensions.marginBottom;

    // Set the position of the left and top axis
    // const axisLeftPercentage = 20; // Percentage
    const axisLeftPosition = dimensions.boundedWidth * (axisLeftPercentage / 100); // Pixels
    const axisTopPosition = 20; // Pixels

    // Get the tooltip party
    const { tooltipContent, setTooltipContent } = useTooltipContext();

    return (
        <div 
            ref={ref} 
            className="w-full relative"
            style={{ height: svgHeight + minHeight }}
        >
            {/* X Axis and top margin */}
            <div
                className="sticky top-0 z-10 backdrop-blur bg-opacity-45 bg-gradient-to-b from-white via-white/50 to-transparent"
            >
                <svg
                    width={dimensions.width}
                    height={minHeight}
                >
                    <XAxis
                        domain={[0, 100]}
                        range={[0, dimensions.boundedWidth]}
                        axisLeftPosition={axisLeftPosition}
                        axisTopPosition={axisTopPosition}
                        axisHeight={minHeight}
                    />
                </svg>
            </div>

            {/* Chart */}
            <svg 
                width={dimensions.width} 
                height={svgHeight}
                onMouseLeave={() => setTooltipContent(null)}
            >
                {/* Events */}
                {events.map((event, index) => {
                    return (
                        <Event
                            key={index}
                            event={event}
                            axisLeftPosition={axisLeftPosition}
                            minHeight={minHeight}
                            firstLegislature={firstLegislature}
                        />
                    )
                })
                }

                {/* Legislatures */}
                {republics.map(republic => (
                    <Republic 
                        key={republic.name} 
                        republic={republic}
                        axisLeftPosition={axisLeftPosition}
                        minHeight={minHeight}
                        firstLegislature={firstLegislature}
                        dimensions={dimensions}
                        currents={currents}
                        nextRepFirstLeg={republics[republics.indexOf(republic) + 1]?.legislatures[0]}
                        axisLeftPercentage={axisLeftPercentage}
                    />
                ))}

                <YAxis
                    domain={[firstLegislature, lastLegislature]}
                    range={[0, (totalDuration) * minHeight]}
                    legislatures={republics.map(republic => republic.legislatures).flat()}
                    axisLeftPosition={axisLeftPosition}
                    axisTopPosition={axisTopPosition}
                />
            </svg>

            {/* Bottom margin */}
            <div className="sticky bottom-0 z-10 backdrop-blur bg-opacity-45 bg-gradient-to-t from-white via-white/50 to-transparent h-7">
            </div>

            {/* Tooltip */}
            {tooltipContent && (
                <Tooltip 
                    chartWidth={dimensions.width}
                    y={tooltipContent.y}
                    axisLeftPosition={axisLeftPosition}
                    xStart={tooltipContent.xStart} 
                    xEnd={tooltipContent.xEnd} 
                    legislature={tooltipContent.legislature} 
                    party={tooltipContent.party} 
                />
            )}
        </div>
    )
}