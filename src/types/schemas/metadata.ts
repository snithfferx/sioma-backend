export interface Metadata {
    id?: number | null;
    name: string;
    position: number;
    active: boolean | null;
    descriptionAllowed: boolean | null;
    collectionAllowed: boolean | null;
    seoAllowed: boolean | null;
    isFeature: boolean | null;
    format: string | null;
    tooltip: string | null;
    groupId: number | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface MetadataValue {
    id: number;
    metadataId: number;
    value: string;
    content: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SingleMetadata {
    id: number;
    name: string;
    position: number;
    isFeature: boolean | null;
    format: string | null;
    tooltip: string | null;
    value: string | null;
    active: boolean | null;
    allow: {
        description: boolean | null;
        collection: boolean | null;
        seo: boolean | null;
    };
    content: string | null;
    metadataValues: MetadataValues | null;
}

export interface MetadataGroup {
    id: number;
    name: string;
    position: number;
    active: boolean | null;
    descriptionAllowed: boolean | null;
    metadatas: MetadataList | null;
}

export type Metadatas = Metadata[];
export type MetadataValues = MetadataValue[];
export type MetadataGroups = MetadataGroup[];
export type MetadataList = SingleMetadata[];