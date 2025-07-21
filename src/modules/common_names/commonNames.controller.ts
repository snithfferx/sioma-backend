import { generateSlug } from "@Utils/slug";
import { CommonNameModel } from "@Modules/common_names/commonName.model";
import type { StoreCategories, CommonName } from "@Types/schemas/commonName";
export class CommonNamesController {
    model = new CommonNameModel();
    constructor() { }

    async selectFillCommonNames() {
        const commonNames = await this.model.selectCommonNames();
        return { status: 'ok', data: commonNames };
    }

    async getAllCommonNames(terms: string | null, page: number, limit: number, active: boolean, sorting: string) {
        const list = [];
        const result = await this.model.getAll(null, page, limit, active, sorting);
        if (result.length > 0) {
            const commonWithParents = await Promise.all(result.map(async (item: CommonName) => {
                const parent = item.parentId ? await this.model.getById(item.parentId) : null;
                const siblings = item.parentId ? await this.model.getCommonSiblings(item.parentId) : [];
                const categories = await this.model.getCategories(item.id);
                const productTypes = await this.model.getProductTypes(item.id);
                const countProducts = await this.model.countProductsByCommonName(item.id);
                return {
                    commonName: { ...item },
                    parent: parent,
                    siblings: siblings,
                    categories: categories,
                    productTypes: productTypes,
                    countProducts: countProducts
                }
            }));
            list.push(...commonWithParents);
        }
        const maxCommon = await this.model.getCount(terms, active);
        const totalPages = Math.ceil(maxCommon[0].count / limit);
        return {
            status: 'ok',
            data: {
                result: list,
                total: maxCommon[0].count,
                pagination: {
                    limit: limit,
                    total: totalPages,
                    current: page,
                },
                terms: {
                    includeActive: active,
                    sort: sorting
                }
            }
        }
    }

    async addCommonName(data: {
        name: string;
        active: boolean;
        position: number;
        descriptionAllowed: boolean;
        parentId: number | null;
        categories: number[];
        productTypes: number[];
        store: {
            id: string | null;
            handle: string;
            keywords: string | null;
            category: {
                Id: string | null;
                name: string | null;
                handle: string | null;
                isLine: number | null;
            };
            categories: StoreCategories;
        } | null;
    }) {
        // console.info("Adding Common Name: ", commonName);
        const commonName = await this.model.add({
            name: data.name,
            active: data.active || true,
            position: data.position || 1,
            descriptionAllowed: data.descriptionAllowed || false,
            parentId: data.parentId || null,
            storeName: data.store?.category?.name || '',
            storeId: data.store && data.store.id ? BigInt(data.store.id) : null,
            handle: data.store ? data.store.handle : '',
            storeCategories: data.store?.categories || []
        });
        if (commonName) {
            data.categories.map(async category => await this.model.addCategory(commonName.id, category));
            data.productTypes.map(async type => await this.model.addProductType(commonName.id, type));
            return { status: 'ok', data: commonName, message: "¡Nombre común creado con exito!" };
        }
        return { status: 'fail', data: null, message: "El Nombre común " + data.name + "no pudo crearse." };
    }

    async createCommonName(data: {
        name: string;
        active: boolean;
        position: number;
        allow: {
            description: boolean;
            collection: boolean;
        };
        parentId: number | null;
        categories: number[];
        productTypes: number[];
    }) {
        const commonName = await this.model.create({
            name: data.name,
            position: data.position,
            active: data.active,
            allow: data.allow,
            parent: data.parentId,
            handle: generateSlug(data.name)
        });
        if (commonName) {
            data.categories.map(async category => await this.model.addCategory(commonName.id, category));
            data.productTypes.map(async type => await this.model.addProductType(commonName.id, type));
            return { status: 'ok', data: commonName, message: "¡Nombre común creado con exito!" };
        }
        return { status: 'fail', data: null, message: "El Nombre común " + data.name + "no pudo crearse." };
    }

    async updateCommonName(id: number, commonName: {
        name: string;
        active: boolean;
    }) {
        const exists = await this.model.getById(id);
        if (exists) {
            const result = await this.model.update(id, commonName);
            return { status: 'ok', data: result, message: '¡Nombre común ' + commonName.name + ' actualizado, exitosamente!' };
        }
        return { status: 'fail', data: null, message: 'Nombre común no encontrado' };
    }

    async deleteCommonName(id: number) {
        const exists = await this.model.delete(id);
        if (exists) {
            return { status: 'ok', data: null, message: '¡Nombre común ' + id + ', eliminado exitosamente!' };
        }
        return { status: 'fail', data: null, message: 'Nombre común no encontrado' };
    }

    async getCommonNameById(id: number) {
        const exists = await this.model.getById(id);
        if (exists) {
            const parent = exists.parent ? await this.model.getById(exists.parent) : null;
            const siblings = exists.parent ? await this.model.getCommonSiblings(exists.parent) : [];
            const children = await this.model.getCommonChildren(exists.id);
            const categories = await this.model.getCategories(exists.id);
            const productTypes = await this.model.getProductTypes(exists.id);
            return {
                status: 'ok',
                data: {
                    commonName: { ...exists },
                    parent: parent,
                    children: children,
                    siblings: siblings,
                    categories: categories,
                    productTypes: productTypes
                },
                message: 'Nombre común ' + exists.name + ' encontrado.'
            }
        }
        return { status: 'fail', data: null, message: 'Nombre común no encontrado' };
    }

    async getCommonNameByName(name: string) {
        const exists = await this.model.getByName(name);
        if (exists) {
            return { status: 'ok', data: exists };
        }
        return {
            status: 'fail', data: null, message: '¡Nombre común ' + name + ', no encontrado!'
        };
    }
}