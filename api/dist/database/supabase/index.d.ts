import type { Database, Entry, Primitive } from "@ponto-certo/api/contract/database";
export declare class SupabaseDatabase implements Database {
    private readonly database;
    constructor(url: string, key: string);
    select(table: string, params?: [string, Primitive | null][]): Promise<Entry[] | Error>;
    insert(table: string, value: Entry): Promise<Entry | Error>;
    update(table: string, value: Entry, params?: [string, Primitive | null][]): Promise<Entry[] | Error>;
    delete(table: string, params?: [string, Primitive | null][]): Promise<Entry[] | Error>;
}
