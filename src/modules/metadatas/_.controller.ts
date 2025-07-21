import { MetadataModel } from '@Modules/metadatas/metadata.model';
import type { Metadata } from '@Types/schemas/metadata';

export class MetadatasController {
	model = new MetadataModel();

	constructor() {
	}

	async getMetadatas(terms: string | null, page: number = 1, limit: number = 10, active: boolean = false, sorting: string = 'asc') {
		const result = await this.model.getAll(terms, page, limit, active, sorting);
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
			}, message: null
		};
	}

	async getMetadata(id: number) {
		const result = await this.model.getById(id);
		if (result) {
			return {status: 'ok', data: result, message: null};
		}
		return {status: 'fail', data: null, message: 'Metadata not found'};
	}

	async create(data: Metadata) {
		const result = await this.model.create(data);
		if (result) {
			return {status: 'ok', data: result, message: null};
		}
		return {status: 'fail', data: null, message: 'Metadata not found'};
	}

	async update(id: number, data: Partial<Metadata> | Metadata) {
		const result = await this.model.update(id, data);
		if (result) {
			return {status: 'ok', data: result, message: null};
		}
		return {status: 'fail', data: null, message: 'Metadata not found'};
	}

	async delete(id: number) {
		const result = await this.model.delete(id);
		if (result) {
			return {status: 'ok', data: result, message: null};
		}
		return {status: 'fail', data: null, message: 'Metadata not found'};
	}

	async selectFill() {
		const result = await this.model.selectFill();
		if (result) {
			return {status: 'ok', data: result, message: null};
		}
		return {status: 'fail', data: null, message: 'Metadata not found'};
	}
}
