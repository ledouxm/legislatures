import { CurrentType } from "../../types/current";
import { EventType } from "../../types/event";
import { FamilyType } from "../../types/family";
import { RepublicType } from "../../types/republic";
import useChartDimensions from "../utils/useChartDimensions";
import Event from "./event";
import Republic from "./republic";
import XAxis from "./xAxis";
import YAxis from "./yAxis";
import * as d3 from "d3";

type Props = {
    republics: RepublicType[];
    currents: FamilyType[];
    events: EventType[];
}

export default function Chart({republics, currents, events}: Props) {
    const [ref, dimensions] = useChartDimensions({
        marginTop: 24,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 24
    })
    const firstLegislature = republics[0].legislatures[0].legislature;
    const lastLegislature = republics[republics.length - 1].legislatures[republics[republics.length - 1].legislatures.length - 1].legislature;
    const totalDuration = lastLegislature - firstLegislature;
    const minHeight = 28;
    const svgHeight = (minHeight * (totalDuration+2)) + dimensions.marginBottom;

    const axisLeftPercentage = 20; // Percentage
    const axisLeftPosition = dimensions.boundedWidth * (axisLeftPercentage / 100); // Pixels
    const axisTopPosition = 20; // Pixels

    return (
        <div 
            ref={ref} 
            className="w-full relative"
            style={{ height: svgHeight + minHeight }}
        >
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
            <svg 
                width={dimensions.width} 
                height={svgHeight}
            >
                {/* Events */}
                {events.map(event => {
                    return (
                        <Event
                            key={event.title}
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
        </div>
    )
}