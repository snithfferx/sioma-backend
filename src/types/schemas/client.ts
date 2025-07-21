import type { ContactRelated, Persona } from "@Types/accounts/persons/persona.schema";

export interface ClientRelated {
    id: string;
    name: string;
    avatar: string | null;
    increase: number | null;
    discount: number | null;
    status: number;
    active: boolean | null;
    persons: Persona[];
    contacts: ContactRelated[];
}