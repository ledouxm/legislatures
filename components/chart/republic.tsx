import Legislature from "./legislature";

export default function Republic({republic, axisLeftPosition, minHeight, firstLegislature, dimensions, currents}) {
    const legislaturesWithIndexes = republic.legislatures.map((leg, i) => {
        return {
            ...leg,
            index: i,
        }
    });
    
    return (
        <g 
            key={republic.name} 
            className={`republic-${republic.name}`}
            transform={`translate(${axisLeftPosition},${0})`}
        >
            {legislaturesWithIndexes.map(leg => {
                // In legislature, find the corresponding current for each party
                const partiesWithCurrents = leg.parties.map(party => {
                    const current = currents.flatMap(family => family.currents).find(current => current.parties.find(p => p.name === party.name));
                    return {
                        ...party,
                        current,
                    }
                });
                const legislatureWithCurrents = {
                    ...leg,
                    parties: partiesWithCurrents,
                }

                // Same for the next legislature
                const nextLeg = legislaturesWithIndexes.find(l => l.index === leg.index + 1);
                const nextPartiesWithCurrents = nextLeg
                    ? nextLeg.parties.map(party => {
                        const current = currents.flatMap(family => family.currents).find(current => current.parties.find(p => p.name === party.name));

                        return {
                            ...party,
                            current,
                        }
                    })
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
                        leg={legislatureWithCurrents}
                        nextLeg={nextLegislatureWithCurrents}
                        firstLegislature={firstLegislature}
                        minHeight={minHeight}
                        dimensions={dimensions}
                    />
                )
            })}
        </g>
    )
}