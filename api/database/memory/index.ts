import type { Database, Entry, QueryParameter, Schema } from "@ponto-certo/api/contract/database";

export class MemoryDatabase implements Database {
    private readonly schema: Schema;
    private readonly database: { [table: string]: Entry[] };

    public constructor(schema: Schema){
        this.schema = schema;
        this.database = {};

        Object.keys(this.schema).forEach(table => this.database[table] = []);

        return this;
    };

    public async select(table: string, params: QueryParameter[] = []){
        if(!this.schema.includes(table)) return new Error("Invalid table");

        if(params.length === 0) return this.database[table];

        return this.database[table].filter(row => params.every(([column, value]) => row[column] === value));
    };

    public async insert(table: string, data: Entry){
        if(!this.schema.includes(table)) return new Error("Invalid table");

        this.database[table].push(data);

        return data;
    };

    public async update(table: string, data: Entry, params: QueryParameter[] = []){
        if(!this.schema.includes(table)) return new Error("Invalid table");

        const updated: Entry[] = [];

        this.database[table].forEach(row => {
            if(!params.every(([column, value]) => row[column] === value)) return;

            Object.keys(data).forEach(column => row[column] = data[column]);

            updated.push(row);
        });

        return updated;
    };

    public async delete(table: string, params: QueryParameter[] = []){
        if(!this.schema.includes(table)) return new Error("Invalid table");

        const deleted: Entry[] = [];

        this.database[table].forEach((row, i) => {
            if(!params.every(([column, value]) => row[column] === value)) return;

            this.database[table].splice(i, 1);

            deleted.push(row);

            return;
        });

        return deleted;
    };
};