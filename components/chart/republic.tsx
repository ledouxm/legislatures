import { CurrentType } from "../../types/current";
import { FamilyType } from "../../types/family";
import { LegislatureType } from "../../types/legislature";
import { RepublicType } from "../../types/republic";
import { ChartDimensions } from "../utils/useChartDimensions";
import Legislature from "./legislature";

type RepublicProps = {
    republic: RepublicType;
    axisLeftPosition: number;
    minHeight: number;
    firstLegislature: number;
    dimensions: ChartDimensions;
    currents: CurrentType[];
    nextRepFirstLeg: LegislatureType | null;
}

export default function Republic({republic, axisLeftPosition, minHeight, firstLegislature, dimensions, currents, nextRepFirstLeg}: RepublicProps) {
    // Add the next rep first legislature to the current republic
    const republicWithNextRepFirstLeg = nextRepFirstLeg 
        ? {
            ...republic,
            legislatures: [
                ...republic.legislatures,
                nextRepFirstLeg,
            ],
        }
        : republic;

    // Give an index to each legislature and currents to each party
    const legislaturesWithIndexes = republicWithNextRepFirstLeg.legislatures.map((leg, i) => {
        // In legislature, find the corresponding current for each party
        const partiesWithCurrents = leg.parties.map(party => {
            const current = currents.find(current => current.parties.find(p => p.name === party.name));
            const full_name = current?.parties.find(p => p.name === party.name)?.full_name;

            if (current) {
                            return {
                                ...party,
                                current,
                                full_name
                            }
                
            } else {
                return;
                
            }
        }).filter(party => party);
        
        return {
            ...leg,
            index: i,
            parties: partiesWithCurrents,
        }
    });
    
    return (
        <g 
            key={republic.name} 
            className={`republic-${republic.name}`}
            transform={`translate(${axisLeftPosition},${0})`}
        >
            {legislaturesWithIndexes.map(leg => {
                // Find the next legislature and add the currents to the parties
                const nextLeg = legislaturesWithIndexes.find(l => l.index === leg.index + 1);
                const nextPartiesWithCurrents = nextLeg
                    ? nextLeg.parties.map(party => {
                        const current = currents.find(current => current.parties.find(p => p.name === party.name));

                        if (current) {
                            return {
                                ...party,
                                current,
                            }
                        } else {
                            return;
                            
                        }
                    }).filter(party => party)
                    : null;
                const nextLegislatureWithCurrents = nextLeg
                    ? {
                        ...nextLeg,
                        parties: nextPartiesWithCurrents,
                    }
                    : null;

                return (
                    <Legislature 
                        key={leg.legislature}
                        leg={leg}
                        nextLeg={nextLegislatureWithCurrents}
                        firstLegislature={firstLegislature}
                        minHeight={minHeight}
                        dimensions={dimensions}
                        axisLeftPosition={axisLeftPosition}
                    />
                )
            })}
        </g>
    )
}