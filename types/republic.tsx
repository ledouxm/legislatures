import { LegislatureType } from "./legislature";

export type RepublicType = {
  name: string;
  begin?: string;
  end?: string;
  legislatures: LegislatureType[];
};
