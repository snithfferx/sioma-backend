import { OptionModel } from "./option.model";
import { OptionsValuesController } from "./optionsValues.controller";
export class OptionsController {
    model = new OptionModel();
    valuesController = new OptionsValuesController();
    constructor() { }
    async createOption(data: {
        name: string;
        values: number[];
    }) {
        return await this.model.create({
            name: data.name,
            values: JSON.stringify(data.values)
        });
    }
    async updateOption(id: number, data: {
        name: string;
        values: number[];
    }) {
        return await this.model.update(id, {
            name: data.name,
            values: JSON.stringify(data.values)
        });
    }
    async getAllOptions(terms: string | null, page: number, limit: number, sorting: string) {
        const options = await this.model.getAll(terms, page, limit, sorting);
        if (!options) return null;
        options.map((option: any) => {
            const values = JSON.parse(option.values as string);
            option.values = [];
            values.map((value: number) => {
                const optionValues = this.valuesController.getOptionValueById(value);
                option.values.push(optionValues);
            });
            return option;
        });
        return options;
    }
    async getOptionById(id: number) {
        return await this.model.getOptionById(id);
    }
    async getSelectFillOptions() {
        const options = await this.model.getSelectFill();
        if (!options) return null;
        return options;
    }
}