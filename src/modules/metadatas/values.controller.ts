import { MetadataValueModel } from '@Modules/metadatas/value.model';

export class MetadatasValuesController {
	model = new MetadataValueModel();
	constructor() {}
	async create(metadata: number,data: { value: string; active: boolean;}) {
		const result = await this.model.create(metadata,data);
		if (result) {
			return {status: 'ok', data: result, message: null};
		}
		return {status: 'fail', data: null, message: 'Metadata not created'};
	}
	
	async read(terms:string | null, page: number = 1, limit: number = 10, active: boolean = false, sorting: string = 'asc') {
		const result = await this.model.getAll(terms, page, limit, active,sorting);
		const total = await this.model.getCount(terms, active);
		const totalPages = Math.ceil(total / limit);
		return {
			status: 'ok',
			data: {
				results: result,
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
			},
			message: null
		};
	}
	
	async update(id: number,data: {
		value: string;
		active: boolean;
		content: string;
		metadata: number;
	}) {
		const result = await this.model.update(id,data);
		if (result) {
			return {status: 'ok', data: result, message: null};
		}
		return {status: 'fail', data: null, message: 'Metadata not updated'};
	}
	
	async delete(id:number) {
		const result = await this.model.delete(id);
		if (result) {
		return {status: 'fail', data: null, message: 'Metadata not deleted'};
		}
			return {status: 'ok', data: result, message: 'Metadata deleted'};
	}
	
	async selectFill() {
		const result = await this.model.selectFill();
		return {status: 'ok', data: result, message: null};
	}

	async readOne(id: number) {
		const result = await this.model.getOne(id);
		if (result) {
			return {status: 'ok', data: result, message: null};
		}
		return {status: 'fail', data: null, message: 'Metadata not found'};
	}
}
