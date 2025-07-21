import { db } from "@DB/sqlite";

export class DteModel {
    async saveCCF(ccf: string) {
        const res = await db.insert(DTECCF).values({
            ccf: ccf
        }).returning();
        return res;
    }
}