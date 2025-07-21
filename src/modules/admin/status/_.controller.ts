import { StatusModel } from "@Modules/admin/status/_.model";

export class StatusController {
    private model = new StatusModel();
    async getAll(terms:string|null,page:number,limit:number,sort:string,active:boolean) {
        const list = [];
        const res = await this.model.getAll(terms,page,limit,sort,active);
        if (res.length > 0) {
            list.push(...res);
        }
        // console.log(res);
        const max = await this.model.getCount(terms, active);
        const totalPages = Math.ceil(max / limit);
        return {
            status: 'ok',
            data: {
                result: list,
                total: max,
                pagination: {
                    limit: limit,
                    total: totalPages,
                    current: page,
                },
                terms: {
                    includeActive: active,
                    sort: sort
                }
            }, message: null
        }
    }

    async getAllActive() {
        return await this.model.getAllActive();
    }

    async getAllInactive() {
        return await this.model.getAllInactive();
    }

    async create(data:{
        name:string;
        description:string;
        active:boolean;
    }) {
        const res = await this.model.create(data);
        if (res) {
            return {status: 'ok',data: res,message: 'Status created successfully'}
        }
        return {status: 'fail',data: null,message: 'Something went wrong'}
    }

    async update(id:number,data:{
        name:string;
        description:string;
        active:boolean;
    }) {
        const res = await this.model.update(id,data);
        if (res) {
            return {status: 'ok',data: res,message: 'Status updated successfully'}
        }
        return {status: 'fail',data: null,message: 'Something went wrong'}
    }

    async delete(id:number) {
        const res = await this.model.delete(id);
        if (res) {
            return {
                status: 'fail',
                data: null,
                message: 'Something went wrong'
            }
        }
        return {
            status: 'ok',
            data: res,
            message: 'Status deleted successfully'
        }
    }

    async getSelectFill() {
        return await this.getAllActive();
    }

    async getById(id:number) {
        return await this.model.getById(id);
    }
}
