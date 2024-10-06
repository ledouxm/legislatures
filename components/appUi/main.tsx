// import EntityDetails from "./entityDetails"

import Chart from "../chart/chart";
import { CurrentType } from "../../types/current";
import { EventType } from "../../types/event";
import { RepublicType } from "../../types/republic";
import { FamilyType } from "../../types/family";

type Props = {
    republics: RepublicType[];
    currents: FamilyType[];
    events: EventType[];
}


export default function Main({republics, currents, events}: Props) {
    return (
        <main 
            className="w-full max-w-screen-3xl mx-auto px-10 mb-8"
            style={{ height: "calc(100vh - 10rem)" }}
        >
            <div className="w-full h-full overflow-y-scroll">

                {/* D3.JS */}
                {republics && currents && events && (
                    <Chart republics={republics} currents={currents} events={events} />
                )}
                
                {/* {selectedEntity && (
                    <div className="w-full h-full flex justify-end items-end relative">
                        <div className="sticky bottom-4">
                                <EntityDetails
                                    entity={selectedEntity}
                                    description={currentDescription}
                                    image={currentImage}
                                    wiki={currentWiki}
                                    parent={null}
                                    onClick={() => {}}
                                    onClose={() => {setSelectedEntity(null)}}
                                />
                        </div>
                    </div>
                )} */}
            </div>
        </main>
    )
}