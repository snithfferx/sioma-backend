import { SupplierModel } from "@Modules/suppliers/supplier.model";

export class SuppliersController {
    private model = new SupplierModel()

    async create(data: {
        name: string;
        active:boolean;
    }) {
        const res = await this.model.create(data)
        if (res) {
            return { status: 'ok', data: res, message: 'Proveedor creado exitosamente' }
        }
        return { status: 'fail', data: null, message: 'Algo salio mal' }
    }

    async getAll(terms: string | null, page: number, limit: number, sort: string, active: boolean) {
        const list = await this.model.getAll(terms, page, limit, sort, active)
        // count records
        const total = await this.model.getCount(terms, active);
        // Total pages
        const totalPages = Math.ceil(total / limit);
        return {
            status: 'ok',
            data: {
                results: list,
                total: total,
                pagination: {
                    current: page,
                    total: totalPages,
                    perPage: limit,
                },
                terms: {
                    sort: sort
                }
            },
            message: null
        }
    }

    async get(id: number) {
        const supplier = await this.model.get(id)
        if (!supplier) return {
            status: 'fail', data: null, message: 'Proveedor no encontrado'
        };
        return {
            status: 'success', data: supplier, message: 'Proveedor encontrado exitosamente'
        };
    }

    async update(id: number, data: {
        name: string;
        active:boolean;
    }) {
        const res = await this.model.update(id, data)
        if (res) {
            return { status: 'ok', data: res, message: 'Proveedor actualizado exitosamente' }
        }
        return { status: 'fail', data: null, message: 'Algo salio mal' }
    }

    async delete(id: number) {
        const res = await this.model.delete(id)
        if (res) {
            return { status: 'ok', data: res, message: 'Proveedor eliminado exitosamente' }
        }
        return { status: 'fail', data: null, message: 'Algo salio mal' }
    }

    async getSelectFill() {
        const list = await this.model.getSelectFill()
        return {
            status: 'ok',
            data: list,
            message: null
        }
    }
}
