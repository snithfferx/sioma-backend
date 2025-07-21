import { db } from "@DB/sqlite";
import { Permissions } from "@DB/sqlite/schema";

export class PermisionModel {
    constructor() {}

    async getAll() {
        const items = await db.select().from(Permissions);
        return items;
    }

    async getSelectFill() {
        const items = await db.select({ value: Permissions.id, label: Permissions.name }).from(Permissions);
        return items;
    }
}