"use client";

import Image from "next/image";
import EntityButton from "./entityButton";
import Badge from "./badge";
import WikiLink from "./wikiLink";
import { Cross1Icon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function EntityDetails({ entity, description, image, wiki, parent, onClick, onClose }) {
    const subEntities = entity.parties || entity.persons;
    const [isVisible, setIsVisible] = useState(true);

    return (
        <article className="rounded-2xl shadow-md w-[28rem] bg-white p-3 flex flex-col gap-4">
            {/* Buttons bar */}
            <div className="flex justify-between w-full h-6">
                <div 
                    className="size-6 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center cursor-pointer text-black/50 hover:text-black transition-all"
                    onClick={() => setIsVisible(!isVisible)}
                >
                    {isVisible ? 
                        <EyeClosedIcon className="size-3.5" /> :
                        <EyeOpenIcon className="size-3.5" />
                    }
                </div>
                <div 
                    className="size-6 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center cursor-pointer text-black/50 hover:text-black transition-all"
                    onClick={onClose}
                >
                    <Cross1Icon className="size-3.5" />
                </div>
            </div>

            {/* Display image if present */}
            {image && (
                <Image
                    src={image}
                    alt={entity.name}
                    width={500}
                    height={500}
                    className="w-full relative object-cover object-[50%_25%] max-h-60 rounded-lg pointer-events-none"
                />
            )}

            {/* Title and infos */}
            <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-col gap-1 items-start">
                    {/* Display parent badge if entity is child */}
                    {entity.full_name && (
                        <Badge
                            name={parent.name}
                            hex={parent.color}
                        />
                    )}
                    <h2 className="text-xl font-bold flex gap-2 items-center">

                        {/* Display color if current */}
                        {entity.color && (
                            <span className="relative flex size-3">
                                <span
                                    className="animate-ping absolute inline-flex size-full rounded-full opacity-75"
                                    style={{ backgroundColor: entity.color }}
                                ></span>
                                <span 
                                    className="relative inline-flex size-3 rounded-full"
                                    style={{ backgroundColor: entity.color }}
                                ></span>
                            </span>
                        )}
                        
                        {/* Display full name if available */}
                        {entity.full_name ? 
                            entity.full_name : 
                            entity.name
                        }
                    </h2>
                    
                    <p className="text-gray-500 text-base leading-snug">
                        {description ? description : "Chargement..."}
                    </p>

                    {wiki && (
                        <WikiLink href={wiki} />
                    )}
                </div>
                
                {subEntities && (
                    <div className="flex flex-col gap-2">
                        {/* <h3 className="font-bold">
                            {entity.color ?
                                "Partis" :
                                "Personnalités"
                            }
                        </h3> */}

                        <ul className="w-full flex overflow-x-scroll gap-1.5 items-start no-scrollbar">
                            {subEntities.map((subEntity, index) => (
                                <div 
                                    className="w-5/6"
                                    key={index}
                                >
                                    <EntityButton
                                        entity={subEntity}
                                        onClick={() => onClick(subEntity)}
                                        isActive={true}
                                    />
                                </div>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </article>
    )
}