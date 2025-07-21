import { ClientModel } from "@Modules/clients/client.model";
import { PersonsController } from "@Modules/accounts/persons/_.controller";
import { ContactsController } from "@Modules/accounts/contacts/_.controller";
import { UsersController } from "@Modules/accounts/users/_.controller";
import { AddressController } from "@Modules/addresses/_.controller";
import { CompaniesController } from "@Modules/accounts/companies/_.controller";
import type { ContactForm, ContactRelated } from "@Types/accounts/persons/persona.schema";
export class ClientsController {
    private model = new ClientModel()
    private personController = new PersonsController()
    private contactController = new ContactsController()
    private userController = new UsersController()
    private addressController = new AddressController()
    private companyController = new CompaniesController()

    async getAll(terms:string|null,page:number,limit:number,sort:string) {
        const list = await this.model.getAll(terms, page, limit, sort)
        // count records
        const total = await this.model.getCount(terms);
        // Total pages
        const totalPages = Math.ceil(total / limit);
        return {
            results: list,
            total: total,
            pagination: {
                current: page,
                total: totalPages,
                perPage: limit,
            },
            terms: {
                sort: sort
            }
        }
    }
    async get(id:string) {
        const client = await this.model.get(id)
        if (!client) return {
            status: 'fail', results: null, message: 'Cliente no encontrado' 
        };
        const contacts = await this.getContacts(client.id);
        return {
            status: 'success', results: {client, contacts:contacts.results}, message: 'Cliente encontrado exitosamente' 
        };
    }
    async create(data:{
        name:string,
        avatar:string|null,
        increase:number,
        discount:number,
        status:number,
        type:string,
        email: string|null,
        registerNumber?: string|null, //Numero de Registro de Contribuyente
        vatNumber?: string|null, //Numero de Identificacion Fiscal
        logo?: string|null,
        phones: {
            home: string|null,
            work: string|null,
            mobile: string|null
        },
        social: {
            whatsapp: string|null,
            skype: string|null
        },
        address: {
            name: string,
            address: string,
            phone: string|null,
            email: string|null,
            country: string,
            state: string,
            city: string,
            street: string,
            optional: string|null,
            status: number
        }
    }) {
        if (data.type == 'person') {
            // create person
            const nameSplit = data.name.split(' ')
            const person = await this.personController.create({
                firstName: nameSplit[0],
                firstLastName: nameSplit[1],
            });
            if (!person) return {
                status: 'fail', results: null, message: 'Error al crear la persona' 
            };
            // create User
            if (!data.email) {
                return {
                    status: 'fail', results: null, message: 'Error al crear el usuario' 
                };
            }
            const user = await this.userController.addUser({
                name: data.name,
                email: data.email,
                password: '123456',
                person: person.id,
                level: 1,
                status: data.status,
                phone: data.phones.home || data.phones.work || data.phones.mobile || '',
            });
            if (!user) return {
                status: 'fail', results: null, message: 'Error al crear el usuario' 
            };
            // create contact
            const contact = await this.contactController.create({
                name: data.name,
                email: data.email,
                phones: {
                    home: data.phones.home,
                    work: data.phones.work,
                    mobile: data.phones.mobile
                },
                social: {
                    whatsapp: data.social.whatsapp,
                    skype: data.social.skype
                }
            })
            if (!contact) return {
                status: 'fail', results: null, message: 'Error al crear el cliente' 
            };
            // create client
            const client = await this.model.create({
                name: data.name,
                avatar: data.avatar,
                increase: data.increase,
                discount: data.discount,
                status: data.status
            })
            if (!client) return {
                status: 'fail', results: null, message: 'Error al crear el cliente' 
            };
            // create address
            const address = await this.addressController.create({
                name: data.address.name,
                address: data.address.address,
                phone: data.address.phone,
                email: data.address.email,
                contact: data.name,
                contactEmail: data.email,
                contactPhone: data.phones.home,
                country: data.address.country,
                state: data.address.state,
                city: data.address.city,
                street: data.address.street,
                optional: data.address.optional,
                status: data.address.status,
            })
            if (!address) return {
                status: 'fail', results: null, message: 'Error al crear la dirección' 
            };
            return {
                status: 'success', results: {person, user, contact, client, address}, message: 'Cliente creado exitosamente' 
            };
        }
        if (data.type == 'company') {
            const nameSplit = data.name.split(' ')
            // loop through nameSplit and extract first letter
            let abbreviation = ''
            for (let i = 0; i < nameSplit.length; i++) {
                abbreviation += nameSplit[i].charAt(0)
            }
            // create contact
            const contact = await this.contactController.create({
                name: data.name,
                email: data.email,
                phones: {
                    home: data.phones.home,
                    work: data.phones.work,
                    mobile: data.phones.mobile
                },
                social: {
                    whatsapp: data.social.whatsapp,
                    skype: data.social.skype
                }
            })
            if (!contact) return {
                status: 'fail', results: null, message: 'Error al crear el cliente'
            };
            // create company
            const company = await this.companyController.create({
                company: {
                    name: data.name,
                    registerNumber: data.registerNumber || null,
                    abbreviation: abbreviation,
                    vatNumber: data.vatNumber || null,
                    logo: data.logo || null,
                    phone: data.phones.work || data.phones.mobile || null,
                    email: data.email || null,
                },
                contact: {
                    name: data.name,
                    email: data.email,
                    phones: {
                        home: data.phones.home,
                        work: data.phones.work,
                        mobile: data.phones.mobile,
                    },
                    social: {
                        whatsapp: data.social.whatsapp,
                        skype: data.social.skype,
                    },
                },
                address: {
                    name: data.address.name,
                    address: data.address.address,
                    phone: data.address.phone || null,
                    email: data.address.email || null,
                    country: data.address.country,
                    state: data.address.state,
                    city: data.address.city,
                    street: data.address.street,
                    optional: data.address.optional || null,
                    status: data.address.status,
                }
            });
            if (!company) return {
                status: 'fail', results: null, message: 'Error al crear la empresa'
            };
            return {
                status: 'success', results: {company, contact}, message: 'Cliente creado exitosamente'
            };
        }
        return {
            status: 'fail', results: null, message: 'El tipo de cliente no es soportado'
        };
    }
    async update(id: string, data: Partial<{
        name: string,
        avatar: string | null,
        increase: number,
        discount: number,
        status: number,
        type: string,
        email: string | null,
        registerNumber?: string | null, //Numero de Registro de Contribuyente
        vatNumber?: string | null, //Numero de Identificacion Fiscal
        logo?: string | null,
    }>) {
        if (!data.name) return {
            status: 'fail', results: null, message: 'El nombre del cliente es requerido' 
        };
        return await this.model.update(id,data)
    }
    async delete(id:string) {
        return await this.model.delete(id)
    }
    async getFill() {
        return await this.model.getSelectFill()
    }

    async getContacts(id: string) {
        const clientContacts = await this.model.getContacts(id);
        const contacts: ContactRelated[] = [];
        clientContacts.map(async item => {
            const contact = await this.contactController.get(item.contactId);
            if (contact.results) {
                contact.results.map(async contact => {
                    contacts.push(contact);
                });
            }
        })
        return {
            status: 'success', results: contacts, message: 'Contactos encontrados exitosamente'
        };
    }

    async addContact(id: string, data: ContactForm) {
        const client = await this.model.get(id);
        if (!client) return {
            status: 'fail', results: null, message: 'Cliente no encontrado'
        };
        const contact = await this.contactController.create({
            name: data.name,
            email: data.email,
            phones: {
                home: data.homePhone,
                work: data.workPhone,
                mobile: data.mobilePhone
            },
            social: {
                whatsapp: data.whatsapp,
                skype: data.skype
            }
        });
        if (!contact) return {
            status: 'fail', results: null, message: 'Error al crear el contacto'
        };
        return {
            status: 'success', results: contact, message: 'Contacto creado exitosamente'
        };
    }
}
