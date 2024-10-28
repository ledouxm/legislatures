import { InfoCircledIcon } from "@radix-ui/react-icons";
import hexToRgb from "../utils/hexToRgb"

export default function Badge({ name, hex, onClick }: { name: string; hex: string; onClick?: () => void }) {
    const color = hexToRgb(hex);

    return (
        <button 
            aria-label={`${name}, détails`}
            className="bg-opacity-10 text-opacity-90 rounded-lg px-1.5 py-1 sm:py-0.5 text-sm sm:text-base font-normal cursor-pointer hover:bg-opacity-20 hover:text-opacity-100 hover:shadow-sm transition text-nowrap items-center flex gap-1.5 h-7"
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
                    var(--tw-border-opacity)
                )` 
            }}
            onClick={onClick}
        >
            {name}
            {/* <InfoCircledIcon className="size-4 inline-block" /> */}
        </button>
    )
}