
type SettingsButtonProps = {
    Icon?: React.ElementType;
    flipIcon?: boolean;
    number?: number;
    color?: string;
    name?: string;
    onClick: () => void;
    isActive?: boolean;
}

export default function SettingsButton({
    Icon, flipIcon, number, color, name, onClick, isActive
}: SettingsButtonProps) {
    return (
        <button 
            className={`group flex items-center justify-center rounded-full border border-black/10 hover:border-black/20 transition text-nowrap gap-2 select-none 
                ${Icon && !name ? 
                    'size-8' : 
                    'h-8 px-3'
                }
                ${number && name ?
                    'pl-1.5 pr-1.5 sm:pr-3' :
                    ''
                }
            `}
            onClick={onClick}
        >
            {(number || number === 0) &&
                <span 
                    className={`flex items-center justify-center  group-hover:bg-[var(--family-color)] transition rounded-full text-xs text-black/50 group-hover:text-white h-5 
                        ${number <= 10 ? 
                            'w-5' : 
                            'px-1.5'
                        }
                        ${isActive ?
                            'bg-[var(--family-color)] text-white group-hover:bg-black/75'
                            : 'bg-black/5'
                        }
                    `}
                    style={{ '--family-color': color } as React.CSSProperties}
                >
                    {number}
                </span>
            }
            {Icon && 
                <Icon className={`size-4 ${flipIcon ? '-scale-x-100' : ''}`} />
            }
            {name && 
                <span className="hidden sm:inline text-black/50 group-hover:text-black transition">
                    {name}
                </span>
            }
        </button>
    )
}