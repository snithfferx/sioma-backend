export interface DsinBrand {
    id: number;
    name: string;
}

export interface DsinProductType {
    id: number;
    name: string | null;
}

export interface DsinCategory {
    id: number;
    name: string;
}

export interface DsinCountry {
    id: number;
    name: string;
}

export interface DsinCommonName {
    id: number;
    name: string;
    position: number | null;
    storeCategory: {
        id: number;
        name: string;
        storeId: string;
        handle: string;
        isLinea: number;
    } | null;
}

export interface DsinClientCategory {
    id: number;
    name: string;
}

export interface DsinProductPrice {
    cost: number;
    added: {
        value: number;
        asignedBy: string;
    };
    value: number;
    asignedBy: string;
    active: boolean;
    category: number;
    store: {
        regular_price: number;
        sale_price: number;
        offer: boolean;
        price_category: number;
    };
    regular_price: number;
    sale_price: number;
    offer: boolean;
    price_category: number;
}
/* {  */
export interface DsinProductSchema {
    product: {
        id: number,
        name: string | null,
        sku: string,
        upc: string | null,
        mpn: string | null,
        image: string | null,
        weight: string | null,
        shortDescription: string | null,
        longDescription: string | null,
        min: number | null,
        max: number | null,
        warranty: string | null,
        storeId: string | null,
        storeStatus: string | null,
    },
    origin: DsinCountry | null,
    type: DsinProductType | null,
    category: DsinCategory | null,
    brand: DsinBrand | null,
    offer: {
        end: string | null,
        isOffer: string | null,
        value: number | null,
        store: number | null,
        isStoreActive: number | null,
        collect: string | null
    },
    price: {
        cost: number | null,
        total: number | null,
        asignBy: string | null,
        added: number | null,
        updatedAt: string | null,
        store: number | null,
        client: string | null,
        category: number | null
    },
    commonName: { id: number; productType: number; name: string; position: number; createdAt: string; active: number; storeId: string; handle: string; keywords: string | null; } | null,
    combo: {
        combo: string,
        id: string
    } | null,
    bundle: {
        bundle: string,
        id: string
    } | null,
    dsComputer: {
        dsComputer: string,
        id: string
    } | null,
    variant: {
        isVariant: number,
        id: string,
        title: string,
        main: string
    } | null
}

export interface CreateProductRequest {
    productType: number;
    image: string;
    name: string;
    upc: string;
    sku: string;
    mpn: string;
    specsLink: string;
    longDescription: string;
    shortDescription: string;
    defaultMinStock: number;
    defaultMaxStock: number;
    defaultWarranty: string;
    warrantyTerms: string;
    showDescription: string;
    warehouse: number;
    disabled: number;
    createdAt: string;
    origin: number;
    weight: string;
    refurbished: string;
    offerEnd: string | null | undefined;
    offer: string | null | undefined;
    discount: string | null | undefined;
    offerStart: string | null | undefined;
    liquidation: string | null | undefined;
    shipping: string | null | undefined;
}

export interface WarehouseStock {
    id: number;
    name: string;
    stock: number;
}

export interface StockBySucursal {
    id: number;
    stocks: {
        [key: string]: WarehouseStock[];
    };
}
export type DsinProductTypes = DsinProductType[];
export type DsinBrands = DsinBrand[];
export type DsinCategories = DsinCategory[];
export type DsinCountries = DsinCountry[];
export type DsinCommonNames = DsinCommonName[];
export type DsinClientCategories = DsinClientCategory[];
