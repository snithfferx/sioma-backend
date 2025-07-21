import { ProductTypeModel } from "@Modules/product_types/productType.model";
export class ProductTypesController {
    model = new ProductTypeModel();
    constructor() { }

    async selectFillProductTypes() {
        const productTypes = await this.model.selectProductTypes();
        return productTypes??null;
    }

    async getAllProductTypes(terms:string | null,page: number=1, limit: number=10, active: boolean=false, sorting:string = 'asc') {
        const data = await this.model.getAll(terms, page, limit, active, sorting);
        const max = await this.model.getCount(terms, active);
        const totalPages = Math.ceil(max / limit);
        return {
            status: 'ok',
            data: {
                result: data,
                total: max,
                pagination:{
                    limit: limit,
                    total: totalPages,
                    current: page,
                },
                terms: {
                    includeActive: active,
                    sort: sorting
                }
            }, message: null
        }
    }

    async getProductTypeById(id: number) {
        const data = await this.model.getById(id);
        if (data) {
        const childrenCount = await this.model.getChildrenCount(id);
        const childrenList = await this.model.getChildren(id);
        const productsCount = await this.model.getProductsCount(id);
        const productsList = await this.model.getProducts(id);
        const categoriesCount = await this.model.getCategoriesCount(id);
        const categoryList = await this.model.getCategories(id);
        const metadataCount = await this.model.getMetadataCount(id);
        const metadataList = await this.model.getMetadata(id);
        const commonNameCount = await this.model.getCommonNameCount(id);
        const commonNameList = await this.model.getCommonName(id);
        return {
            status: 'ok',
            data: {
                productType: data,
                children:{
                    count: childrenCount,
                    list: childrenList
                },
                products:{
                    count: productsCount,
                    list: productsList
                },
                categories:{
                    count: categoriesCount,
                    list: categoryList
                },
                metadatas:{
                    count: metadataCount,
                    list: metadataList
                },
                commonNames:{
                    count: commonNameCount,
                    list: commonNameList
                }
            }, message: null
        }}
        return { status: 'fail', data: null, message: 'Product Type not found' };
    }

    async addProductType(data: {
        name: string | null;
        parent?: number;
        active?: boolean;
        slug?: string;
    }) {
        // console.info("Adding Product Type: ", data);
        return await this.model.save({
            name: data.name || 'NPT',
            parent: data.parent,
            active: data.active,
            slug: data.slug
        });
    }

    async updateProductType(id: number, data: {
        name: string;
        parent?: number;
        active?: boolean;
        slug?: string;
    }) {
        const res = await this.model.update(id, {
            name: data.name,
            parent: data.parent,
            active: data.active,
            slug: data.slug
        });
        if (res) {
            return { status: 'ok', data: res, message: null };
        }
        return { status: 'fail', data: null, message: 'Product Type not updated' };
    }

    async createProductType(data: {
        name: string;
        parent?: number;
        active?: boolean;
        slug?: string;
    }) {
        const res = await this.model.create(data);
        if (res) {
            return { status: 'ok', data: res, message: null };
        }
        return { status: 'fail', data: null, message: 'Product Type not created' };
    }

    async deleteProductType(id: number) {
        const res = await this.model.delete(id);
        if (res) {
            return { status: 'ok', data: res, message: null };
        }
        return { status: 'fail', data: null, message: 'Product Type not deleted' };
    }
}