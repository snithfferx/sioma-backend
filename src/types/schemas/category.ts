export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parents: {
        id: number | null,
        name: string | null
    }[];
    active: boolean;
    storeId: bigint | null;
    storeName: string | null;
    handle: string | null;
    allow: {
        description: boolean;
        collection: boolean;
    }
}
export interface SingleCategory {
    id: number;
    name: string;
    slug: string;
}

export interface CategorySchema {
    parents: {
        id: number;
        name: string | null;
    }[];
    id: number;
    name: string;
    slug: string;
    description: string | null;
    active: boolean | null;
    storeId: bigint | null;
    storeName: string | null;
    handle: string | null;
    descriptionAllowed: boolean | null;
    collectionAllowed: boolean | null;
}
export type Categories = Category[];
export type CategoryList = SingleCategory[];
