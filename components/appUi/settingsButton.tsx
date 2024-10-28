
type SettingsButtonProps = {
    Icon?: React.ElementType;
    flipIcon?: boolean;
    number?: number;
    color?: string;
    name?: string;
    onClick: () => void;
    isActive?: boolean;
    label: string;
}

export default function SettingsButton({
    Icon, flipIcon, number, color, name, onClick, isActive, label
}: SettingsButtonProps) {
    return (
        <button 
            aria-label={label}
            className={`group flex items-center justify-center rounded-full border border-black/10 hover:border-black/20 transition text-nowrap gap-2 select-none bg-white
                ${Icon && !name
                    ? 'size-9 flex-shrink-0'
                    : 'h-9 px-3'
                }
                ${(number || number === 0) && name 
                    ? 'pl-1.5 pr-3'
                    : ''
                }
            `}
            onClick={onClick}
        >
            {(number || number === 0) &&
                <span 
                    className={`flex items-center justify-center  group-hover:bg-[var(--family-color)] transition rounded-full text-xs group-hover:text-white size-6 
                        ${isActive
                            ? 'bg-[var(--family-color)] text-white group-hover:bg-black/75'
                            : 'bg-black/5 text-black/65'
                        }
                    `}
                    style={{ '--family-color': color } as React.CSSProperties}
                >
                    {number}
                </span>
            }
            {Icon && 
                <Icon className={`size-4 ${flipIcon ? '-scale-x-100' : ''} transition-transform`} />
            }
            {name && 
                <span className="inline text-black/60 group-hover:text-black transition text-nowrap">
                    {name}
                </span>
            }
        </button>
    )
}