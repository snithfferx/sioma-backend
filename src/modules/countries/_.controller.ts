import { CountryModel } from "./country.model";

export class CountriesController {
    constructor() {
        this.model = new CountryModel();
    }

    model: CountryModel;
    async getSelectFillCountries() {
        const countries = await this.model.selectCountries();
        return { status: 'ok', data: countries, message: null };
    }

    async getAllCountries(terms: string|null, page: number, limit: number, active: boolean, sorting: string) {
        const countries = await this.model.getAll(terms, page, limit, active, sorting);
        const total = await this.model.getCount(terms, active);
        const totalPages = Math.ceil(total / limit);
        return {
            status: 'ok',
            data: {
                result: countries,
                total: total,
                pagination: {
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

    async getCountryById(id: number) {
        const country = await this.model.getById(id);
        if (country) {
            return { status: 'ok', data: country, message:null };
        }
        return { status: 'fail', data: null, message: 'Country not found' };
    }

    async createCountry(data: {
        name: string;
        code: string | null;
        zip: string | null;
        area: string | null;
        flag: string | null;
        active: boolean | null;
    }) {
        const country = await this.model.create(data);
        if (country) {
            return { status: 'ok', data: country, message: null };
        }
        return { status: 'fail', data: null, message: 'Country not found' };
    }

    async updateCountry(id: number, data: {
        name: string;
        code: string | null;
        zip: string | null;
        area: string | null;
        flag: string | null;
        active: boolean | null;
    }) {
        const country = await this.model.update(id, data);
        if (country) {
            return { status: 'ok', data: country, message: null };
        }
        return { status: 'fail', data: null, message: 'Country not found' };
    }

    async searchCountries(terms: string|null,page:number =1,limit:number = 10,active:boolean = false,sorting:string = 'asc') {
        const countries = await this.model.search(terms);
        const total = await this.model.getCount(terms, active);
        const totalPages = Math.ceil(total / limit);
        return {
            status: 'ok',
            data: {
                result: countries,
                total: total,
                pagination: {
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

    async deleteCountry(id: number) {
        return await this.model.delete(id);
    }
}
