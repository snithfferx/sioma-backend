import { BrandModel } from "@Modules/brands/brand.model";

export class BrandsController {
    model = new BrandModel();
    constructor() { }

    async createBrand(data: {
        name: string;
        description: string|null;
        logo: string | null;
        status?: number;
    }) {
        if (!data.name) {
            return { status: 'fail', data: null, message: 'Name is required.' };
        }
        const brand = await this.model.create(data);
        if (brand) {
            return { status: 'ok', data: { id: brand.id, name: data.name }, message: "Brand created successfully" };
        } else {
            return { status: 'fail', data: null, message: "Brand already exists" };
        }
    }

    async getBrandById(id: number) {
        const brand = await this.model.getById(id);
        if (brand) {
            return { status: 'ok', data: brand, message: "Brand found" };
        } else {
            return { status: 'fail', data: null, message: "Brand not found" };
        }
    }

    async getBrandByName(name: string) {
        const brand = await this.model.getByName(name);
        if (brand) {
            return { status: 'ok', data: brand, message: "Brand found" };
        } else {
            return { status: 'fail', data: null, message: "Brand not found" };
        }
    }

    async getAllBrands(terms: string|null, page: number = 1, limit: number = 10, active: boolean = false, sorting: string = 'asc') {
        const list = [];
        const res = await this.model.getAllByTerms(terms, page, limit, active, sorting);
        if (res.length > 0) {
            list.push(...res);
        }
        // console.log(res);
        const max = await this.model.getCount(terms, active);
        const totalPages = Math.ceil(max[0].count / limit);
        return {
            status: 'ok',
            data: {
                result: list,
                total: max[0].count,
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

    async updateBrand(id: number, data: {
        name: string;
        description: string;
        logo: string[] | null;
        active: boolean;
    }) {
        const brand = await this.model.update(id, {
            name: data.name,
            description: data.description,
            logo: data.logo ? JSON.stringify(data.logo) : null,
            active: data.active
        });
        if (brand) {
            return { status: 'ok', data: brand, message: "Brand updated successfully" };
        } else {
            return { status: 'fail', data: null, message: "Brand not found" };
        }
    }

    async selectFillBrands() {
        const brands = await this.model.selectBrands();
        return {
            status: 'ok', data: brands, message: null
        };
    }

    async deleteBrand(id: number) {
        const brand = await this.model.delete(id);
        if (brand) {
            return { status: 'ok', data: brand, message: "Brand deleted successfully" };
        } else {
            return { status: 'fail', data: null, message: "Brand not found" };
        }
    }
}