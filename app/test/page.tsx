"use client";

import { useEffect, useState } from "react";
import EntityDetails from "../../components/appUi/entityDetails";
import EntityButton from "../../components/appUi/entityButton";
import { PartyType } from "../../types/party";

export default function TestPage() {
    const [republics, setRepublics] = useState(null);
    const [currents, setCurrents] = useState(null);
    const [selectedRepublic, setSelectedRepublic] = useState(null);
    const [selectedCurrent, setSelectedCurrent] = useState(null);
    const [currentDescription, setCurrentDescription] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentWiki, setCurrentWiki] = useState(null);
    const [selectedParty, setSelectedParty] = useState(null);
    const [partyDescription, setPartyDescription] = useState(null);
    const [partyImage, setPartyImage] = useState(null);
    const [partyWiki, setPartyWiki] = useState(null);

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

    const updateDescription = (paragraph: string, party: PartyType, target: string, keyword: string, attempt: number) => {
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

    const fetchWiki = (keyword: string, party: PartyType, target: string, attempt: number = 0) => {
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
        <div className="p-5">
            <h1 className="text-2xl font-normal mb-6">
                Historique des compositions de l&apos;assemblée nationale des Républiques Françaises
            </h1>

            <div className="gap-5 grid grid-cols-1 md:grid-cols-3 items-start">
                <section className="p-3 rounded-xl border border-gray-300 shadow-sm flex flex-col gap-3">
                    <h2 className="text-xl font-bold">
                        Courants politiques
                    </h2>
                    {currents ? 
                        (<ul className="w-full flex flex-wrap gap-2 items-start">
                            {currents.map((family, i) => (
                                family.currents.map((current, index) => (
                                    <EntityButton 
                                        key={index}
                                        entity={current} 
                                        onClick={() => {
                                            fetchWiki(current.keyword, null, 'current')
                                            setCurrentDescription(null)
                                            setCurrentImage(null)
                                            setSelectedCurrent(current)
                                            setSelectedParty(null)
                                            setPartyDescription(null)
                                            setPartyImage(null)
                                        }}
                                        isActive={selectedCurrent === current}
                                    />
                                ))
                            ))}
                        </ul>) :
                        (<p className="text-gray-500">Chargement…</p>)
                    }
                </section>

                {selectedCurrent && (
                    <EntityDetails 
                        entity={selectedCurrent} 
                        description={currentDescription}
                        image={currentImage}
                        wiki={currentWiki}
                        parent={null}
                        onClick={(party) => {
                            setPartyDescription(null)
                            setPartyImage(null)
                            setSelectedParty(party)
                            fetchWiki(party.keyword ? party.keyword : party.full_name, party, 'party')
                        }}
                        onClose={() => {
                            setCurrentDescription(null)
                            setCurrentImage(null)
                            setSelectedCurrent(null)
                        }}
                    />
                )}
                {selectedParty && (
                    <EntityDetails
                        entity={selectedParty}
                        description={partyDescription}
                        image={partyImage}
                        wiki={partyWiki}
                        parent={selectedCurrent}
                        onClick={() => {}}
                        onClose={() => {
                            setPartyDescription(null)
                            setPartyImage(null)
                            setSelectedParty(null)
                        }}
                    />
                )}
            </div>
        </div>
    )
}