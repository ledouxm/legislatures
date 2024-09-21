import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function WikiLink({ href }: { href: string }) {
    return (
        <Link
            href={href}
            target="_blank"
            className="mt-1 text-sm small-caps group flex items-center gap-1 py-0.5 px-1.5 rounded-full border border-blue-200 text-blue-400 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 shadow-sm hover:shadow-md transition"
        >
            <ExternalLinkIcon
                className="size-3.5 group-hover:scale-110 transition"
            />
            Wikipédia
        </Link>
    )
}