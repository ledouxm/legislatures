import { useEffect, useState } from "react";
import { Family } from "../../types/family";
import SettingsButton from "./settingsButton";
import EntityButton from "./entityButton";

type Props = {
    family: Family;
    onCurrentClick: (current: any) => void;
}

export default function CurrentsFamily({ family, onCurrentClick }: Props) {
    const [isActive, setIsActive] = useState(false);

    // Merge two currents if they have the same name (even with additionnal space), keep the name and color of the first one, and merge the parties
    const [mergedCurrents, setMergedCurrents] = useState([]);

    useEffect(() => {
      const mergeCurrents = () => {
        const courantMap = {};
  
        family.currents.forEach((courant) => {
            // Erase the spaces at the beginning and end of the name
            const normalizedName = courant.name.trim();
  
            // If the current already exists in the map, we merge the parties
            if (courantMap[normalizedName]) {
                courantMap[normalizedName].parties = [
                    ...courantMap[normalizedName].parties,
                    ...courant.parties,
                ];
            } else {
            // Otherwise, we add the current to the map
            courantMap[normalizedName] = { ...courant, name: normalizedName };
            }
        });
  
        // Convert the map to an array
        setMergedCurrents(Object.values(courantMap));
      };
  
      mergeCurrents();
    }, [family]);
  

    return (
        <>
            <SettingsButton 
                number={mergedCurrents.length} 
                color={family.color} 
                name={family.name} 
                onClick={() => {setIsActive(!isActive)}} 
                isActive={isActive} 
            />
            {isActive &&
                <>
                    {mergedCurrents.map((current, index) => (
                        <EntityButton 
                            key={index} 
                            entity={current} 
                            onClick={() => {onCurrentClick(current)}} 
                            isActive={true} 
                        />
                    ))}
                </>
            }
        </>
    )
}