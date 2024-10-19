"use client";

import Image from "next/image";
import EntityButton from "./entityButton";
import Badge from "./badge";
import WikiLink from "./wikiLink";
import { Cross1Icon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Key, useEffect, useRef, useState } from "react";
import { useDetailsContext } from "../utils/detailsContext";
import { CurrentType } from "../../types/current";
import { EventType } from "../../types/event";
import { PartyType } from "../../types/party";
import { useVisibleCurrentsContext } from "../utils/currentsContext";

function truncateString(str: string, num: number) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
}

export default function EntityDetails() {
    // Get the entity to display from the context
    const { detailsContent, setDetailsContent } = useDetailsContext();
    const { entity, parent } = detailsContent;

    // Set the details content
    const [description, setDescription] = useState(null);
    const [image, setImage] = useState(null);
    const [wikiLink, setWikiLink] = useState(null);    

    // Determine the entity type and create typed entity
    const entityType = "parties" in entity ? "current" : "title" in entity ? "event" : "party";
    const current = entityType === "current" ? entity as CurrentType : null;
    const party = entityType === "party" ? entity as PartyType : null;
    const event = entityType === "event" ? entity as EventType : null;

    const updateWikiLink = (
        wikiUrl: string, 
        keyword: string, 
    ) => {
        let fullWikiLink = wikiUrl;

        if (keyword.search("#") !== -1) {
            fullWikiLink = wikiUrl + "#" + encodeURIComponent(keyword.split("#")[1].replace(/ /g, "_"));
        }

        // Update the link
        setWikiLink(fullWikiLink);
    }

    const fetchWiki = (searchTerm: string) => {
        const noInfo = 'Aucune information disponible…';
        fetch('/api/wiki', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword: searchTerm }),
        })
        .then((response) => response.json())
        .then((data) => {
            setDescription(data.firstParagraph || noInfo);
            setImage(data.thumbnail);
            updateWikiLink(data.pageUrl, searchTerm);
        });
    }
    // Fetch the entity content on mount
    useEffect(() => {
        if (entity) {
            fetchWiki(entity.keyword || title);
        }
    }, [entity, fetchWiki]);


    // Get the sub entities
    const subEntities = current?.parties || party?.persons || null;
            
    // Get the entity title
    const title = event?.title || party?.full_name || current?.name;

    // Determine if the displayed current is visible or not
    const { visibleCurrents, setVisibleCurrents } = useVisibleCurrentsContext();
    let isVisible = false;
    if (current) {
        isVisible = visibleCurrents.some((c) => c.name === current.name);
    }
    // Hide or show the current
    function handleVisibility() {
        isVisible
            ? setVisibleCurrents(visibleCurrents.filter((c) => c.name !== current.name))
            : setVisibleCurrents([...visibleCurrents, current]);
    }

    // Close the details
    function handleClose() {
        setDetailsContent(null);
    }
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, []);

    // Open the details of the sub entity
    function onClick(subEntity: any, entity?: any) {
        setDetailsContent({
            entity: subEntity,
            parent: entity
        });
    }

    // Convert vertical scroll to horizontal scroll
    const detailsScrollRef = useRef<HTMLUListElement>(null);
    useEffect(() => {
        const element = detailsScrollRef.current;

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
        <div className="fixed bottom-5 right-8 z-50 rounded-2xl shadow-md w-[28rem] bg-white p-3 flex flex-col gap-4">
            {/* Buttons bar */}
            <div className="flex justify-between w-full h-6">
                {/* If current, add a button to display or hide it */}
                {current 
                    ? <div 
                        className="size-6 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center cursor-pointer text-black/50 hover:text-black transition-all"
                        onClick={() => handleVisibility()}
                    >
                        {isVisible ? 
                            <EyeOpenIcon className="size-3.5" /> :
                            <EyeClosedIcon className="size-3.5" />
                        }
                    </div>
                    // If party, display the parent badge
                    : party
                        ? <Badge
                            name={(parent as CurrentType).name}
                            hex={(parent as CurrentType).color}
                            onClick={() => onClick(parent)}
                        />
                        // If event, display nothing
                        : event 
                            ? <div></div>
                            : <div></div>
                        // // If person, display the parent button
                        // : <EntityButton
                        //     entity={parent}
                        //     onClick={() => {}}
                        //     isActive={true}
                        // />
                }
                <div 
                    className="size-6 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center cursor-pointer text-black/50 hover:text-black transition-all"
                    onClick={handleClose}
                >
                    <Cross1Icon className="size-3.5" />
                </div>
            </div>

            {/* Display image if present */}
            {image && (
                <Image
                    src={image}
                    alt={title}
                    width={500}
                    height={500}
                    className="w-full relative object-cover object-[50%_25%] max-h-60 rounded-lg pointer-events-none shadow-sm"
                />
            )}

            {/* Title and infos */}
            <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-col gap-1 items-start">
                    <h2 className="text-xl font-bold flex gap-2 items-center">

                        {/* Display color if current */}
                        {current && current.color && (
                            <span className="relative flex size-3">
                                <span
                                    className="animate-ping absolute inline-flex size-full rounded-full opacity-75"
                                    style={{ backgroundColor: current.color }}
                                ></span>
                                <span 
                                    className="relative inline-flex size-3 rounded-full"
                                    style={{ backgroundColor: current.color }}
                                ></span>
                            </span>
                        )}
                        
                        {title}
                    </h2>
                    
                    <p className="text-gray-500 text-base leading-snug">
                        {/* If more than 500 characters, truncate */}
                        {description ? truncateString(description, 400) : "Chargement…"}
                    </p>

                    {wikiLink && (
                        <WikiLink href={wikiLink} />
                    )}
                </div>
                
                {subEntities && (
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold">
                            {current ?
                                "Courants" :
                                "Personnalités"
                            }
                        </h3>

                        <ul 
                            ref={detailsScrollRef}
                            className="w-full flex overflow-x-scroll gap-1.5 justify-start no-scrollbar"
                        >
                            {subEntities.map((subEntity: PartyType | any, index: Key) => (
                                <div 
                                    className="w-4/6"
                                    key={index}
                                >
                                    <EntityButton
                                        entity={subEntity}
                                        onClick={() => onClick(subEntity, entity)}
                                        isActive={true}
                                    />
                                </div>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}