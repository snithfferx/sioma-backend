export interface WarehouseStock {
    id: number;
    name: string;
    stock: number;
}

export interface ShopinguiCategory {
    id: number | null;
    name: string | null;
    slug: string | null;
    description: string | null;
    parents: string | null;
    client: number | null;
    active: boolean | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface ShopinguiCategoryResponse {
    success: boolean;
    categories: ShopinguiCategory[];
}

export interface ShopinguiCategories {
    id: number;
    name: string;
    description: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ShopinguiProductStocks {
    total: {
        [key: string]: number;
    };
    sucursals: {
        id: number;
        name: string;
        stocks: WarehouseStock[];
    }[];
}

export interface ShopinguiProduct {
    id: number;
    productType: {
        id: number;
        name: string | null;
    } | null;
    category: {
        id: number;
        name: string;
        client: number | null;
    } | null;
    image: string | null;
    name: string | null;
    upc: string | null;
    sku: string | null;
    specsLink: string | null;
    defaultWarranty: string | number | null;
    disabled: number | boolean;
    weight: string | null | undefined;
    offerEnd: string | null;
    offer: string | boolean | null;
    mpn: string | null;
    min: number | null;
    max: number | null;
    stocks: ShopinguiProductStocks | null;
    origin: {
        id: number;
        name: string;
    } | null;
    priceCategory: number | null;
    brand: {
        id: number;
        name: string;
    } | null;
    commonName: {
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
    }[];
    store: {
        id: string;
        price: {
            type: number;
            value: number;
            offer: boolean;
        };
        status: string;
        combo: string | null;
        bundle: string | null;
        dsComputer: string | null;
        variant: {
            id: string;
            main: string;
            value: string;
        }
    };
    price: {
        value: number;
        cost: number;
        added: {
            value: number;
            asignedBy: string | null;
            updatedAt: string | null;
        } | null;
    } | null;
    metadata: {
        id: number | null;
        name: string | null;
        value: string;
        position: number | null;
        active: number | null;
        isFeature: number | null;
        tooltip: string | null;
        format: string | null;
        allowDescription: number | null;
        group: {
            id: string | null;
            name: string | null;
            order: number | null;
        };
    }[];
    tags: string[];
}

export interface ShopinguiProductType {
    id: number;
    name: string | null;
    category: number;
    isLine: number;
    priceCategory: number;
}

export interface ShopinguiBrand {
    id: number | null;
    name: string | null;
    description: string | null;
    logo: string | null;
    active: boolean | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface ShopinguiBrandResponse {
    success: boolean;
    brands: ShopinguiBrand[];
}

export interface ShopinguiBrands {
    id: number;
    name: string;
    description: string;
    logo: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ShopinguiCommonName {
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

export interface ShopinguiProductPrice {
    cost: number;
    value: number;
    category: number;
    added: {
        value: number
        asignedBy: string
    }
    active: boolean;
    store: {
        regular_price: number
        sale_price: number
        offer: boolean
        price_category: number
    }
}

export interface ShopinguiMetadata {
    id: number | null;
    name: string | null;
    value: string;
    position: number | null;
    active: number | null;
    isFeature: number | null;
    tooltip: string | null;
    format: string | null;
    allowDescription: number | null;
    group: {
        id: string | null;
        name: string | null;
        order: number | null;
    };
}

export interface ShopinguiGroup {
    id: string;
    name: string;
    order: number;
}

export interface ShopinguiGroupResponse {
    success: boolean;
    groups: ShopinguiGroup[];
}

export interface ShopinguiMetadataGroup {
    id: number;
    name: string;
    metadata: Array<{
        id: number;
        name: string;
        value: string;
        position: number;
        active: boolean;
        isFeature: boolean;
        tooltip?: string;
        format?: string;
    }>;
}

export type ShopinguiMetadatas = ShopinguiMetadata[];
export type ShopinguiGroups = ShopinguiGroup[];
export type ShopinguiMetadataGroups = ShopinguiMetadataGroup[];
export type ShopifyProductTypes = ShopinguiProductType[];
export type ShopifyBrands = ShopinguiBrand[];
export type ShopifyCategories = ShopinguiCategory[];
export type ShopifyCommonNames = ShopinguiCommonName[];
export type ShopifyProducts = ShopinguiProduct[];
export type ShopifyProductPrices = ShopinguiProductPrice[];
