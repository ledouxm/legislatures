"use client";

import { useEffect, useState } from "react";
import { PartyType } from "../../types/party";

export default function Tooltip({ party }: { party: PartyType }) {
    // Get mouse position
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (event: { pageX: number; pageY: number; }) => {
            setMousePosition({ 
                x: event.pageX, 
                y: event.pageY, 
            });
        };

        document.addEventListener("mousemove", handleMouseMove);
        // Clean up event listener on unmount
        return () => document.removeEventListener("mousemove", handleMouseMove);
    }, []);

    console.log(mousePosition);

    return (
        <div 
            className="p-4 rounded-md fixed flex flex-col bg-white shadow-md z-50"
            style={{ 
                top: `${mousePosition.y + 15}px`, 
                left: `${mousePosition.x + 15}px`, 
            }}
        >
            <h3><span className="size-2.5 mr-1 pb-0.5 inline-block rounded-full" style={{ backgroundColor: party.current.color }}></span> {party.name}</h3>
            {party.full_name && <p>{party.full_name}</p>}
            {party.deputes && <p>{party.deputes} députés</p>}
            {party.coalition && <p>Coalition: {party.coalition}</p>}
        </div>
    );
}