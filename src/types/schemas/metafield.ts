export interface Metafield {
    id: number | null;
    name: string;
    position: number;
    namespace: string;
    value: string;
    contentType: string;
    active: boolean;
    allowDescription: boolean;
    isFeature: boolean;
    format: string;
    tooltip: string;
    idGroup: number;
}

export interface SingleMetafield {
    id: number;
    name: string;
    position: number;
    namespace: string;
    content: {
        value: string;
        type: string;
        format: string;
        tooltip: string;
    };
    active: boolean;
    allowDescription: boolean;
    isFeature: boolean;
    idGroup: number;
}

export type Metafields = Metafield[];
export type MetafieldList = SingleMetafield[];
