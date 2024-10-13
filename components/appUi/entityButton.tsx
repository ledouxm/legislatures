import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function EntityButton({ entity, onClick, isActive }) {

    return (
        <button
            className={`group flex gap-2 items-center max-w-full h-full text-black/50 hover:text-black bg-black/5 hover:bg-black/10 transition text-base text-nowrap 
                ${isActive ? "" : "opacity-50"}
                ${entity.full_name ? "px-1.5 rounded-md" : "px-3 rounded-full"}
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
                    <span className="text-black/30 group-hover:text-black/50 all-small-caps mr-1 inline-flex h-full text-xs transition">
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
            {entity.full_name && <InfoCircledIcon className="size-4 inline-block" />}
        </button>
    )
}