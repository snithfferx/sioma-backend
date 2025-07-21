import { OptionValueModel } from "./optionValue.model";

export class OptionsValuesController {
    model = new OptionValueModel();
    constructor() { }
    async createOptionValues(data: {
        name: string;
        optionId: number;
        active: boolean;
        image: string;
        code: string;
        value: string;
        abbreviation: string;
        customized: boolean;
    }) {
        return await this.model.create(data);
    }
    async updateOptionValues(id: number, data: {
        name: string;
        optionId: number;
        active: boolean;
        image: string;
        code: string;
        value: string;
        abbreviation: string;
        customized: boolean;
    }) {
        return await this.model.update(id, data);
    }

    async getAllOptionValues(terms: string | null, page: number, limit: number, active: boolean, sorting: string) {
        return await this.model.getAll(terms, page, limit, active, sorting);
    }

    async getValuesByOption(id: number) {
        return await this.model.getValueByOption(id);
    }

    async getOptionValueById(id: number) {
        return await this.model.getOptionValueById(id);
    }
}