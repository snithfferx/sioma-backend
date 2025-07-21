import { AddressModel } from "@Modules/addresses/address.model";
import type { AddressType } from "@Types/schemas/address";

export class AddressController {
    model = new AddressModel()
    async getAll(terms:string|null,page:number,limit:number,sort:string) {
        return await this.model.getAll(terms, page, limit, sort)
    }
    async get(id:string) {
        return await this.model.getById(id)
    }
    async create(data:AddressType) {
        return await this.model.create(data)
    }
    async update(id:string,data:Partial<AddressType>) {
        return await this.model.update(id,data)
    }
    async delete(id:string) {
        return await this.model.delete(id)
    }
    async getFill(who:string,id:number) {
        return await this.model.getFill(who,id)
    }
    async disassociate(who:string,id:number,addressId:number) {
        return await this.model.disassociate(who,id,addressId)
    }
}