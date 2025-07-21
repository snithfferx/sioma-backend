export interface Price {
    id: number | null;
    product: number;
    cost: number;
    added: number;
    value: number;
    asignBy: number;
    regularPrice: number;
    salePrice: number;
    offer: boolean;
    category: string | null;
    active: boolean;
}

export interface SinglePrice {
    id: number | null;
    regularPrice: number;
    salePrice: number;
    offer: boolean;
    category: string | null;
}

export type Prices = Price[];
export type PriceList = SinglePrice[];
