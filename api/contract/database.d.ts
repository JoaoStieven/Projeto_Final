export interface Database {
    select(table: string, params?: QueryParameter[]): Promise<Entry[] | Error>;
    insert(table: string, data: Entry): Promise<Entry | Error>;
    update(table: string, data: Entry, params?: QueryParameter[]): Promise<Entry[] | Error>;
    delete(table: string, params?: QueryParameter[]): Promise<Entry[] | Error>;
}

export type Entry = { [x: string]: any };

export type Schema = string[];

export type Primitive = number | string | boolean;

type QueryParameter = [string, Primitive];