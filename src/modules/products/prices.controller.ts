import { PriceModel } from "./price.model";

export class PricesController {
    private model = new PriceModel();
    /**
     * Add price
     * @param variant variant id
     * @param data price data
     * @returns 
     */
    async addPrice(variant:number,data: {
        cost:number;
        added:number;
        discount:number;
        increase:number;
        category:number;
        offer:number;
        asignedBy:string;
        margin?:number;
        regularPrice?:number;
    }) {
        const price = await this.model.create(variant,data);
        if (price) {
            return {status:'ok',data:price,message:'Price added correctly.'};
        } else {
            return {status:'fail',data:null,message:'Price already exists.'};
        }
    }
    /**
     * Edit price
     * @param variant variant id
     * @param data price data
     * @returns 
     */
    async editPrice(id:number,data: {
        cost?:number;
        added?:number;
        discount?:number;
        increase?:number;
        category?:number;
        offer?:number;
        asignedBy?:string;
        margin?:number;
        regularPrice?: number;
    }) {
        const price = await this.model.update(id,data);
        if (price) {
            return {status:'ok',data:price,message:'Price updated correctly.'};
        } else {
            return {status:'fail',data:null,message:'Price not found.'};
        }
    }
    /**
     * Remove price
     * @param variant variant id
     * @returns 
     */
    async removePrice(id:number) {
        const price = await this.model.delete(id);
        if (price) {
            return {status:'ok',data:price,message:'Price removed correctly.'};
        } else {
            return {status:'fail',data:null,message:'Price not found.'};
        }
    }
    /**
     * Get price
     * @param id price id
     * @returns 
     */
    async getPrice(id:number) {
        const price = await this.model.getById(id);
        if (price) {
            return {status:'ok',data:price,message:'Price found.'};
        } else {
            return {status:'fail',data:null,message:'Price not found.'};
        }
    }
    /**
     * Get all prices
     * @returns 
     */
    async getAllPrices() {
        const prices = await this.model.getAll();
        if (prices) {
            return {status:'ok',data:prices,message:'Prices found.'};
        } else {
            return {status:'fail',data:null,message:'Prices not found.'};
        }
    }
    /**
     * Get all prices by variant
     * @param variant variant id
     * @returns 
     */
    async getAllPricesByVariant(variant:number) {
        const prices = await this.model.getAllByVariant(variant);
        if (prices) {
            return {status:'ok',data:prices,message:'Prices found.'};
        } else {
            return {status:'fail',data:null,message:'Prices not found.'};
        }
    }
}