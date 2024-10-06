import { PartyType } from "./party";

export type LegislatureType = {
    legislature: number;
    total_deputes: number;
    duration: number;
    parties: PartyType[];
}