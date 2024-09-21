import hexToRgb from "../utils/hexToRgb"

export default function Badge({ name, hex }: { name: string, hex: string }) {
    const color = hexToRgb(hex);

    return (
        <span 
            className="bg-opacity-10 text-opacity-90 rounded px-1.5 py-0.5 text-xs font-normal cursor-pointer hover:bg-opacity-20 hover:text-opacity-100 hover:shadow-sm transition text-nowrap"
            style={{ 
                backgroundColor: `rgb(
                    ${color}, 
                    var(--tw-bg-opacity)
                )`,
                color: `rgb(
                    ${color}, 
                    var(--tw-text-opacity)
                )`,
                borderColor: `rgb(
                    ${color}, 
                    var(--tw-text-opacity)
                )` 
            }}
        >
            {name}
        </span>
    )
}