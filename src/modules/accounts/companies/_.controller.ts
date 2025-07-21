import { CompanyModel } from "@Modules/accounts/companies/company.model";
import { ContactsController } from "@Modules/accounts/contacts/_.controller";
import { AddressController } from "@Modules/addresses/_.controller";
export class CompaniesController {
    private model = new CompanyModel();
    private contactController = new ContactsController();
    private addressController = new AddressController();
    async create(data: {
        company: {
            name: string,
            registerNumber: string | null,
            abbreviation: string,
            vatNumber: string | null,
            logo: string | null,
            phone: string | null,
            email: string | null
        },
        contact: {
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
        },
        address: {
            name: string,
            address: string,
            phone: string | null,
            email: string | null,
            country: string,
            state: string,
            city: string,
            street: string,
            optional: string | null,
            status: number
        }
    }) {
        if (!data.company.name) return {
            status: 'fail', results: null, message: 'El nombre de la empresa es requerido' 
        };
        if (!data.contact.name) return {
            status: 'fail', results: null, message: 'El nombre del contacto es requerido' 
        };
        if (!data.address.name) return {
            status: 'fail', results: null, message: 'El nombre de la dirección es requerido' 
        };
        const company = await this.model.create(data.company);
        if (!company) return {
            status: 'fail', results: null, message: 'Error al crear la empresa' 
        };
        const contact = await this.contactController.create(data.contact);
        if (!contact) return {
            status: 'fail', results: null, message: 'Error al crear el contacto' 
        };
        const address = await this.addressController.create({
            name: data.address.name,
            contact: data.contact.name,
            contactEmail: data.contact.email,
            contactPhone: data.contact.phones.home || data.contact.phones.work || data.contact.phones.mobile,
            address: data.address.address,
            phone: data.address.phone,
            email: data.address.email,
            country: data.address.country,
            state: data.address.state,
            city: data.address.city,
            street: data.address.street,
            optional: data.address.optional,
            status: data.address.status,
        });
        if (!address) return {
            status: 'fail', results: null, message: 'Error al crear la dirección' 
        };
        return {status:'ok', results:{company, contact, address },message:null };
    }
}