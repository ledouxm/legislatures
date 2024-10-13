"use client";

type PercentageButtonProps = { 
    percentage: number; 
    deputies: number; 
    totalDeputies: number;
    isPercentage: boolean;
    onHover: () => void;
};

export default function PercentageButton({ percentage, deputies, totalDeputies, isPercentage, onHover }: PercentageButtonProps) {
    return (
        <div 
            className="flex items-center py-0.5 px-1.5 rounded-full bg-black/5 hover:bg-black/10 text-xs group/percentage cursor-pointer transition"
            onMouseEnter={onHover}
            onMouseLeave={onHover}
        >
            <span className="text-black/50 group-hover/percentage:text-black transition">
                {isPercentage
                    ? percentage.toFixed(1)
                    : deputies
                }
            </span>
            <span className="text-black/35 group-hover/percentage:text-black/50 transition">
                {isPercentage
                    ? "\u202F%"
                    : "/" + totalDeputies
                }
            </span>
        </div>
    )
}