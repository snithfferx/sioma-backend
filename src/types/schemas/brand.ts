export interface Brand {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    active: boolean | null;
}
export type Brands = Brand[];