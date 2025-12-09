import type { Database, Entry, QueryParameter, Schema } from "@ponto-certo/api/contract/database";
export declare class MemoryDatabase implements Database {
    private readonly schema;
    private readonly database;
    constructor(schema: Schema);
    select(table: string, params?: QueryParameter[]): Promise<Error | Entry[]>;
    insert(table: string, data: Entry): Promise<Error | Entry>;
    update(table: string, data: Entry, params?: QueryParameter[]): Promise<Error | Entry[]>;
    delete(table: string, params?: QueryParameter[]): Promise<Error | Entry[]>;
}
