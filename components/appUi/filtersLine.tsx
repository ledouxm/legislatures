"use client";

import { EyeClosedIcon, MixerVerticalIcon, ReloadIcon, ShuffleIcon } from "@radix-ui/react-icons";
import EntityButton from "./entityButton";
import { CurrentType } from "../../types/current";
import { useEffect, useRef, useState } from "react";
import { FamilyType } from "../../types/family";
import CurrentsFamily from "./currentsFamily";
import SettingsButton from "./settingsButton";

type Props = {
    families: FamilyType[];
    onFilterChange: (current: CurrentType) => void;
}

export default function FiltersLine({ families, onFilterChange }: Props) {
    const [isActive, setIsActive] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    function handleClick(current) {
        onFilterChange(current);
        setIsActive(!isActive);
    }

    // Convert vertical scroll to horizontal scroll
    useEffect(() => {
        const element = scrollRef.current;

        const handleScroll = (e: WheelEvent) => {
            if (element) {
                if (e.deltaY !== 0) {
                    // Scroll horizontally
                    element.scrollLeft += e.deltaY;
                    // Prevent vertical scroll
                    e.preventDefault();
                }
            }
        };
        if (element) {
            element.addEventListener('wheel', handleScroll, { passive: false });
        }
        return () => {
            if (element) {
                element.removeEventListener('wheel', handleScroll);
            }
        };
    }, []);
    

    return (
        <section className="w-full h-20 md:h-36 px-5 md:px-10 mb-3 md:mb-6 flex items-end max-w-screen-3xl mx-auto">
            <div className="w-full flex">
                {/* List controls */}
                <div className="flex gap-1 items-center h-8">
                    {/* <SettingsButton Icon={MixerVerticalIcon} name="Filtrer" onClick={() => {}} /> */}
                    <SettingsButton Icon={ShuffleIcon} onClick={() => {}} />
                    <SettingsButton Icon={ReloadIcon} flipIcon={true} onClick={() => {}} />
                </div>

                {/* Currents list */}
                <div className="relative overflow-hidden w-full">
                    <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white via-white z-30 pointer-events-none -translate-x-1.5"></div>
                    <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white via-white z-30 pointer-events-none translate-x-1.5"></div>
                    <div className="overflow-x-scroll h-full flex gap-1 no-scrollbar px-3.5" ref={scrollRef}>
                        {families ? families.map((family, index) => (
                            <CurrentsFamily 
                                key={index} 
                                family={family}
                                onCurrentClick={handleClick}
                            />
                        )) : (
                            <span className="animate-pulse pointer-events-none">
                                <EntityButton
                                    entity={{name: "Chargement..."}}
                                    onClick={() => {}}
                                    isActive={isActive}
                                />
                            </span>
                        )}
                        {/* {currents ? currents.map((current, index) => (
                            <EntityButton
                                key={index}
                                entity={current}
                                onClick={() => handleClick(current)}
                                isActive={isActive}
                            />
                        )) : (
                            <span className="animate-pulse pointer-events-none">
                                <EntityButton
                                    entity={{name: "Chargement..."}}
                                    onClick={() => {}}
                                    isActive={isActive}
                                />
                            </span>
                        )} */}
                    </div>
                </div>
            </div>
        </section>
    )
}