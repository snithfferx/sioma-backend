import type { RequestMenuItem, MenuWithSubItem } from "@Types/schemas/menu/item";
import { MenuSidebarModel } from "./menuSidebar.model";

export class MenuSidebarController {
    model = new MenuSidebarModel();
    constructor() {}

    async getAllItems(): Promise<{ status: string, data: MenuWithSubItem[], message: string|null}> {
        const items = await this.model.getAllItems();
        if (items.length == 0) {
            await this.initalize();
            return this.getAllItems();
        }
        const subItems = await Promise.all(items.map(async (item) => {
            const children = await this.model.getSubItems(item.id);
            return {
                ...item,
                submenu: children,
            };
        }));

        return {
            status: 'ok',
            data:subItems,
            message: null
        }
    }

    async getItemById(id: number) {
        const item = await this.model.getItemById(id);
        if (!item) {
            return { status: 'fail', data: null, message: "Item not found" };
        }
        const children = await this.model.getSubItems(item.id);
        return { status: 'ok', data: {
            ...item,
            permissions: JSON.parse(item.permissions)?? {} as Record<string, string>,
            submenu: children,
        }, message: null };
    }

    async getItemsList(page:number=1,limit:number=10,sorting:string='asc') {
        const list = await this.model.getItemsList(page, limit, sorting);
        // console.log(list);
        const max = await this.model.getCount();
        const totalPages = Math.ceil(max / limit);
        return {
            status: 'ok',
            data: {
                result: list,
                total: max,
                pagination:{
                    limit: limit,
                    total: totalPages,
                    current: page,
                },
                terms: {
                    includeActive: false,
                    sort: sorting
                }
            }, message: null
        }
    }

    async createItem(item: Partial<RequestMenuItem>) {
        if (!item.name || !item.path || !item.icon) {
            return { status: 'fail', data: null, message: "Item not created" };
        }
        // console.log("newItem",item);
        const permisions = item.permissions ? JSON.stringify(item.permissions) : '[]';
        const newItem = await this.model.createItem({
            name: item.name,
            path: item.path,
            icon: item.icon,
            parentId: item.parent??null,
            position: item.position??1,
            permissions: permisions
        });
        return { status: 'ok', data: newItem, message: "Item created" };
    }

    async updateItem(id: number, item: Partial<RequestMenuItem>) {
        const updatedItem = await this.model.updateItem(id, {
            name: item.name,
            path: item.path,
            icon: item.icon,
            parentId: item.parent??null,
            position: item.position??1,
            permissions: item.permissions?.join(",")??'[]'
        });
        return { status: 'ok', data: updatedItem, message: "Item updated" };
    }

    async deleteItem(id: number) {
        const deletedItem = await this.model.deleteItem(id);
        return { status: 'ok', data: deletedItem, message: "Item deleted" };
    }

    async createSubItem(item: Partial<RequestMenuItem>) {
        if (!item.name || !item.path || !item.icon) {
            return { status: 'fail', data: null, message: "Item not created" };
        }
        const newItem = await this.model.createItem({
            name: item.name,
            path: item.path,
            icon: item.icon,
            parentId: item.parent??null,
            position: item.position??1,
            permissions: item.permissions?.join(",")??'[]'
        });
        return { status: 'ok', data: newItem, message: "Item created" };
    }

    async initalize() {
        const items = [
            {
                name: "Recursos",
                path: "/resources",
                icon: "dataset",
                position: 1
            },
            {
                name: "Productos",
                path: "/products",
                icon: "inventory_2",
                position: 2
            },
            {
                name: "Ordenes",
                path: "/orders",
                icon: "shopping_cart",
                position: 3
            }, {
                name: "Clientes",
                path: "/customers",
                icon: "group",
                position: 4,
            },
            {
                name: "Settings",
                path: "/settings",
                icon: "settings",
                position: 5,
            },
            {
                name: "Promociones",
                path: "/offers",
                icon: "sell",
                position: 6,
            },
            {
                name: "Administración",
                path: "/admin",
                icon: "admin_panel_settings",
                position: 1,
                parentId: 1
            },
            {
                name: "Categorias",
                path: "resources/categories",
                icon: "category",
                position: 1,
                parentId: 1
            },
            {
                name: "Marcas",
                path: "resources/brands",
                icon: "filter_7",
                position: 2,
                parentId: 1
            },
            {
                name: "Tipos de productos",
                path: "resources/product-types",
                icon: "account_tree",
                position: 3,
                parentId: 1
            },
            {
                name: "Nombres Comunes",
                path: "resources/common-names",
                icon: "share",
                position: 4,
                parentId: 1
            },
            {
                name: "Países",
                path: "resources/countries",
                icon: "flag",
                position: 5,
                parentId: 1
            },
            {
                name: "Variantes",
                path: "products/variants",
                icon: "compare",
                position: 1,
                parentId: 2
            },
            {
                name: "Metadatos",
                path: "products/metadata",
                icon: "page_info",
                position: 2,
                parentId: 2
            }
        ];
        for (const item of items) {
            await this.createItem(item);
        }
    }

    // async getPermissions() {
    //     const permissions = await this.model.getPermissions();
    //     return permissions;
    // }

    async getFill() {
        const permissions = await this.model.getSelectFill();
        return {status:'ok',data:permissions,message:null};
    }

    async getSidebarItems () {
        const parents = await this.model.getParents();
        const menu = await Promise.all(parents.map(async parent => {
            const children = await this.model.getSubItems(parent.id);
            return {
                ...parent,
                permissions: JSON.parse(parent.permissions)?? {} as Record<string, string>,
                submenu: children,
            };
        }));
        return {status:'ok',data:menu,message:null};
    }
}   