export interface Persona {
    firstName: string;
    secondName?: string | null;
    firstLastName: string;
    secondLastName?: string | null;
    thirdName?: string | null;
    thirdLastName?: string | null;
    gender?: string | null;
    birthday?: number | null;
    address?: string | null;
    phone?: string | null;
}

export type Personas = Persona[];