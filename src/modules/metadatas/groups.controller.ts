import {MetadataGroupModel} from "@Modules/metadatas/group.model";
export class MetadataGroupController {
	model = new MetadataGroupModel();
	constructor() {}
	async create(data: {
		name: string;
		active: boolean;
		position: number;
		descriptionAllowed: boolean;
	}) {
		console.log("new item",data);
		return await this.model.create(data);
		// if (result) {
		// 	return {status: 'ok', data: result, message: null};
		// }
		// return {status: 'fail', data: null, message: 'Metadata Group not created'};
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
		name: string;
		active: boolean;
		position: number;
		descriptionAllowed: boolean;
	}) {
		const result = await this.model.update(id,data);
		if (result) {
			return {status: 'ok', data: result, message: null};
		}
		return {status: 'fail', data: null, message: 'Metadata Group not updated'};
	}

	async delete(id:number) {
		const result = await this.model.delete(id);
		if (result) {
			return {status: 'fail', data: null, message: 'Metadata Group not deleted'};
		}
		return {status: 'ok', data: result, message: 'Metadata Group deleted'};
	}

	async selectFill() {
		const result = await this.model.selectFill();
		return {status: 'ok', data: result, message: null};
	}

	async getOne(id: number) {
		const res = await this.model.getById(id);
		if (res) {
			return {status: 'ok', data: res, message: null};
		}
		return {status: 'fail', data: null, message: 'Metadata Group not found'};
	}
}
