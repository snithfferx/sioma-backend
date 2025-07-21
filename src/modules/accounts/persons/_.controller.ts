import { PersonModel } from './person.model';
import type { Persona } from '@Types/schemas/accounts/persona.schema';
export class PersonsController {
	model = new PersonModel();

	constructor() { }

	async addNewPerson(data: {
		firstName: string;
		firstLastName: string;
		email: string;
	}) {
		return await this.model.signupPerson(data);
	}

	async addNewContact(data: any) {
		return await this.model.addNewContact(data);
	}

	async create(data: Partial<Persona>) {
		return await this.model.addNewPerson(data);
	}

	async get(id:number) {
		const res = await this.model.getById(id);
		if (res) {
			return {status:'ok', results:res,message:'ok'}
		}
		return {status:'fail', results:null,message:'Persona no encontrada'}
	}
}
