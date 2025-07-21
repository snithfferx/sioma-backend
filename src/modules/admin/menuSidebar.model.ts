import { db } from "@DB/sqlite";
import { SidebarMenuItem } from "@DB/sqlite/schema";
import { eq, isNull, asc, desc, count } from "drizzle-orm";

export class MenuSidebarModel {
    constructor() {}

    async getAllItems() {
        const items = await db.select().from(SidebarMenuItem).orderBy(asc(SidebarMenuItem.name));
        return await Promise.all(items.map(async (item) => {
            let parent = null;
            if (item.parentId) {
                const res = await db.select({ name: SidebarMenuItem.name }).from(SidebarMenuItem).where(eq(SidebarMenuItem.id, item.parentId)).get();
                if (res) {
                    parent = {
                        id: item.parentId,
                        name: res.name
                    };
                }
            }
            return {
                id: item.id,
                name: item.name,
                path: item.path,
                icon: item.icon,
                position: item.position,
                permissions: JSON.parse(item.permissions) ?? {},
                parent: parent,
                history: {
                    created: item.createdAt,
                    updated: item.updatedAt
                }
            };
        }))
    }

    async getItemById(id: number) {
        const item = await db.select().from(SidebarMenuItem).where(eq(SidebarMenuItem.id, id)).get();
        return item;
    }

    async createItem(item: {
        name: string;
        path: string;
        icon: string;
        parentId: number|null;
        position: number;
        permissions: string;
    }) {
        const newItem = await db.insert(SidebarMenuItem).values(item).returning();
        return newItem;
    }

    async updateItem(id: number, item: Partial<{
        name: string;
        path: string;
        icon: string;
        parentId: number | null;
        position: number;
        permissions: string;
    }>) {
        const updatedItem = await db.update(SidebarMenuItem).set(item).where(eq(SidebarMenuItem.id, id)).returning();
        return updatedItem;
    }

    async deleteItem(id: number) {
        const deletedItem = await db.delete(SidebarMenuItem).where(eq(SidebarMenuItem.id, id)).returning();
        return deletedItem;
    }

    async getSubItems(id: number) {
        const subItems = await db.select({
            id: SidebarMenuItem.id,
            name: SidebarMenuItem.name,
            path: SidebarMenuItem.path,
            icon: SidebarMenuItem.icon,
            position: SidebarMenuItem.position,
            permissions: SidebarMenuItem.permissions
        }).from(SidebarMenuItem).where(eq(SidebarMenuItem.parentId, id)).orderBy(asc(SidebarMenuItem.position));
        return subItems;
    }

    async getItemsList(page:number,limit:number,sorting:string) {
        const offset = page > 1 ? (page - 1) * limit : 0;
        const list = [];
        if (sorting === 'asc') {
            const items = await db.select().from(SidebarMenuItem).limit(limit).offset(offset).orderBy(asc(SidebarMenuItem.name));
            list.push(...items);
        } else {
            const items = await db.select().from(SidebarMenuItem).limit(limit).offset(offset).orderBy(desc(SidebarMenuItem.name));
            list.push(...items);
        }
        // console.log("dblloist: ", list);
        return await Promise.all(list.map(async (item) => {
            let parent = null;
            if (item.parentId) {
                const res = await db.select({name: SidebarMenuItem.name}).from(SidebarMenuItem).where(eq(SidebarMenuItem.id, item.parentId)).get();
                if (res) {
                    parent = {
                        id: item.parentId,
                        name: res.name
                    };
                }
            }
            // console.log("permisions", item.permissions);
            return {
                id:item.id,
                name:item.name,
                path:item.path,
                icon:item.icon,
                position:item.position,
                permissions: JSON.parse(item.permissions)?? {},
                parent:parent,
                history:{
                    created:item.createdAt,
                    updated:item.updatedAt
                }
            };
        }))
    }

    async getCount() {
        const max = await db.select({ count: count(SidebarMenuItem.id) }).from(SidebarMenuItem).get();
        return max ? max.count : 0;
    }

    async getSelectFill() {
        const items = await db.select({ value: SidebarMenuItem.id, label: SidebarMenuItem.name }).from(SidebarMenuItem).where(isNull(SidebarMenuItem.parentId));
        return items;
    }
    async getParents() {
        const items = await db.select({
            id: SidebarMenuItem.id,
            name: SidebarMenuItem.name,
            path: SidebarMenuItem.path,
            icon: SidebarMenuItem.icon,
            position: SidebarMenuItem.position,
            permissions: SidebarMenuItem.permissions
        }).from(SidebarMenuItem).where(isNull(SidebarMenuItem.parentId)).orderBy(asc(SidebarMenuItem.position));
        return items;
    }
}
