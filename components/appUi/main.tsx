import EntityDetails from "./entityDetails"

export default function Main({selectedEntity, currentDescription, currentImage, currentWiki, setSelectedEntity}) {
    return (
        <main className="w-full h-screen max-w-screen-3xl mx-auto px-10 mb-8">
            <div className="w-full h-full rounded-4xl bg-gradient-to-br from-neutral-300 to-stone-400 p-4">
                <div className="w-full h-full flex justify-end items-end relative">
                    <div className="sticky bottom-4">
                        {selectedEntity && (
                            <EntityDetails
                                entity={selectedEntity}
                                description={currentDescription}
                                image={currentImage}
                                wiki={currentWiki}
                                parent={null}
                                onClick={() => {}}
                                onClose={() => {setSelectedEntity(null)}}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}