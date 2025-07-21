import { ContactModel } from "@Modules/accounts/contacts/contact.model";
export class ContactsController {
    private model = new ContactModel();
    async create(data: {
        name: string,
        email: string | null,
        phones: {
            home: string | null,
            work: string | null,
            mobile: string | null
        },
        social: {   
            whatsapp: string | null,
            skype: string | null
        }
    }) {
        if (!data.name) return {
            status: 'fail', results: null, message: 'El nombre del contacto es requerido' 
        };
        const contact = await this.model.create(data);
        if (!contact) return {
            status: 'fail', results: null, message: 'Error al crear el contacto' 
        };
        return {status:'ok', results:contact,message:null };
    }

    async get(id:number) {
        const contact = await this.model.getById(id);
        if (!contact) return {
            status: 'fail', results: null, message: 'Contacto no encontrado' 
        };
        return {status:'ok', results:contact,message:null };
    }
}
