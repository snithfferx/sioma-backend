import { PermisionModel } from "./permision.model";

export class PermisionsController {
    model = new PermisionModel();
    constructor() {}

    async getAll() {
        const items = await this.model.getAll();
        return items;
    }

    async getSelectFill() {
        const items = await this.model.getSelectFill();
        return items;
    }
}