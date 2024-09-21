export default function EntityButton({ entity, onClick, isActive }) {

    return (
        <button
            className={`group rounded-full flex gap-2 items-center max-w-full h-full px-3 text-black/50 hover:text-black bg-black/5 hover:bg-black/10 transition text-base text-nowrap 
                ${isActive ? "" : "opacity-50"}
                ${entity.full_name ? "pl-2.5 pr-3" : ""}
                `}
            onClick={() => onClick(entity)}
        >
            {/* Currents have color point */}
            {entity.color && (
                <span
                    className="relative flex size-3"
                >
                    <span
                        className="group-hover:animate-ping absolute inline-flex size-full rounded-full opacity-75"
                        style={{ backgroundColor: entity.color }}
                    ></span>
                    <span
                        className="relative inline-flex size-3 rounded-full"
                        style={{ backgroundColor: entity.color }}
                    ></span>
                </span>
            )}

            <span className="flex items-center min-w-0">
                {entity.full_name && (
                    <span className="text-black/30 group-hover:text-black/50 all-small-caps mr-1 inline-flex h-full text-xs">
                        {entity.name}
                    </span>                        
                )}
                
                {/* If party, display full name */}
                <span className="truncate">
                    {entity.full_name ?
                        entity.full_name :
                        entity.name
                    }
                </span>
            </span>
        </button>
    )
}
// className="text-sm group border border-gray-300 rounded-full flex gap-2 items-center px-3 py-0.5 cursor-pointer shadow-sm hover:shadow-md hover:bg-gray-50 transition text-nowrap"