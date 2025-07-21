export interface CommonName {
    id: number;
    name: string;
    position: number | null;
    active: boolean;
    descriptionAllowed: boolean;
    collectionAllowed: boolean;
    parentId: number | null;
    storeId: bigint | null,
    storeName: string | null,
    handle: string | null,
    storeCategories: unknown | string | null;
}

export interface StoreCategory {
    id: number;
    name: string;
    categoryId: number;
    storeId: bigint;
    handle: string;
    isLinea: number;
    offerId: number;
    promoHandle: string;
    position: number;
    active: boolean;
}

export interface SingleCommonName {
    id: number;
    name: string;
    position: number | null;
    active: boolean;
    allow: {
        description: boolean;
        collection: boolean;
    };
    parentId: number | null;
    store: {
        id: bigint | null,
        name: string | null,
        handle: string | null,
    } | null,
    storeCategories: StoreCategories;
}

export type CommonNames = CommonName[];
export type StoreCategories = StoreCategory[];
export type FullCommonNameList = SingleCommonName[];
