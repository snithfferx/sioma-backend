export interface Country {
    id: number;
    name: string;
    code: string | null;
    zip: string | null;
    area: string | null;
    flag: string | null;
    active: boolean | null;
}

export type Countries = Country[];