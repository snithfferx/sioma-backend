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
    client: number | null;
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

export interface DsinProductSchema {
    product: {
        id: number,
        name: string,
        sku: string,
        upc: string,
        mpn: string,
        image: string,
        weight: number,
        shortDescription: string,
        longDescription: string,
        min: number,
        max: number,
        warranty: number,
        storeId: number,
        storeStatus: number,
    },
    origin: DsinCountry,
    type: DsinProductType,
    category: DsinCategory,
    brand: DsinBrand,
    offer: {
        end: number,
        isOffer: number,
        value: number,
        store: number,
        isStoreActive: number,
        collect: number
    },
    price: {
        cost: number,
        total: number,
        asignBy: string,
        added: number,
        updatedAt: string,
        store: number,
        client: string,
        category: number
    },
    commonName: DsinCommonName,
    combo: {
        combo: string,
        id: string
    },
    bundle: {
        bundle: string,
        id: string
    },
    dsComputer: {
        dsComputer: string,
        id: string
    },
    variant: {
        isVariant: number,
        id: string,
        title: string,
        main: number
    }
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
