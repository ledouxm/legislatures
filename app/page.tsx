"use client";

import { useEffect, useState } from "react";
import FiltersLine from "../components/appUi/filtersLine";
import EntityDetails from "../components/appUi/entityDetails";
import { Party } from "../types/party";
import Main from "../components/appUi/main";

export default function HomePage() {
    const [republics, setRepublics] = useState(null);
    const [currents, setCurrents] = useState(null);
    const [selectedCurrent, setSelectedCurrent] = useState(null);
    const [currentDescription, setCurrentDescription] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentWiki, setCurrentWiki] = useState(null);
    const [selectedParty, setSelectedParty] = useState(null);
    const [partyDescription, setPartyDescription] = useState(null);
    const [partyImage, setPartyImage] = useState(null);
    const [partyWiki, setPartyWiki] = useState(null);

    // Fetch the data
    useEffect(() => {
        // Fetch the republics
        fetch('/data/republics.json')
            .then((response) => response.json())
            .then((data) => setRepublics(data));

        // Fetch the currents
        fetch('/data/currents.json')
            .then((response) => response.json())
            .then((data) => setCurrents(data.families));
    }, []);


    const updateDescription = (paragraph: string, party: Party, target: string, keyword: string, attempt: number) => {
        // If no paragraph is found, try to fetch the description with the keyword
        if (!paragraph && attempt < 4 && party) {
            const fallbackKeyword = [keyword.toLocaleLowerCase(), keyword.toLowerCase()];
            if (party.keyword) {
                fallbackKeyword.push(party.keyword, party.keyword.toLowerCase());
            }
            attempt++;
            fetchWiki(fallbackKeyword[attempt], party, target, attempt);
            return;
        }

        // Update the description for corresponding target
        if (target === 'current') {
            setCurrentDescription(paragraph);
        } else {
            setPartyDescription(paragraph);
        }
    }
    
    const updateImage = (image: string, target: string) => {
        if (target === 'current') {
            setCurrentImage(image);
        } else {
            setPartyImage(image);
        }
    }

    const updateLink = (wiki: string, keyword: string, target: string) => {
        let fullWiki = wiki;

        if (keyword.search("#") !== -1) {
            fullWiki = wiki + "#" + encodeURIComponent(keyword.split("#")[1].replace(/ /g, "_"));
        }

        if (target === 'current') {
            setCurrentWiki(fullWiki);
        } else {
            setPartyWiki(fullWiki);
        }
    }

    const fetchWiki = (keyword: string, party: Party, target: string, attempt: number = 0) => {
        if (!keyword) {
            const noInfo = 'Aucune information disponible…';
            updateDescription(noInfo, party, target, keyword, attempt);
        } else {
            fetch('/api/wiki', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keyword: keyword }),
            })
                .then((response) => response.json())
                .then((data) => {
                    updateDescription(data.firstParagraph, party, target, keyword, attempt);
                    updateImage(data.thumbnail, target);
                    updateLink(data.pageUrl, keyword, target);
                });
        }
    }

    return (
        <>
            <header className="grid grid-cols-12 gap-6 px-10 mt-8 mb-6 max-w-screen-3xl mx-auto">
                <h1 className="col-start-1 col-span-12 md:col-span-7 text-3xl md:text-5xl">
                    <span className="opacity-40">
                        Entre crises et revendications
                    </span>
                    <br/>
                    Les évolutions de la représentation des courants politiques au sein de l’Assemblée Nationale
                </h1>
                <div className="md:col-start-8 md:col-span-5 flex flex-col items-start text-2xl">
                    <p className="opacity-75">
                        Ce site est une représentation visuelle des résultats des élections législatives françaises depuis leur création. Pariatur minim irure ex magna voluptate eiusmod minim dolore duis laboris ad.
                    </p>
                    <button className="opacity-30 hover:opacity-50">
                        En savoir plus
                    </button>
                </div>
            </header>
            <FiltersLine 
                families={currents} 
                onFilterChange={(current) => {
                    fetchWiki(current.keyword, null, 'current')
                    setCurrentDescription(null)
                    setCurrentImage(null)
                    setSelectedCurrent(current)
                    setSelectedParty(null)
                    setPartyDescription(null)
                    setPartyImage(null)
                }}
            />
            <Main 
                selectedEntity={selectedCurrent}
                currentDescription={currentDescription}
                currentImage={currentImage}
                currentWiki={currentWiki}
                setSelectedEntity={setSelectedCurrent}
            />
        </>
    )
} 