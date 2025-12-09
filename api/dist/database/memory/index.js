export class MemoryDatabase {
    schema;
    database;
    constructor(schema) {
        this.schema = schema;
        this.database = {};
        Object.keys(this.schema).forEach(table => this.database[table] = []);
        return this;
    }
    ;
    async select(table, params = []) {
        if (!this.schema.includes(table))
            return new Error("Invalid table");
        if (params.length === 0)
            return this.database[table];
        return this.database[table].filter(row => params.every(([column, value]) => row[column] === value));
    }
    ;
    async insert(table, data) {
        if (!this.schema.includes(table))
            return new Error("Invalid table");
        this.database[table].push(data);
        return data;
    }
    ;
    async update(table, data, params = []) {
        if (!this.schema.includes(table))
            return new Error("Invalid table");
        const updated = [];
        this.database[table].forEach(row => {
            if (!params.every(([column, value]) => row[column] === value))
                return;
            Object.keys(data).forEach(column => row[column] = data[column]);
            updated.push(row);
        });
        return updated;
    }
    ;
    async delete(table, params = []) {
        if (!this.schema.includes(table))
            return new Error("Invalid table");
        const deleted = [];
        this.database[table].forEach((row, i) => {
            if (!params.every(([column, value]) => row[column] === value))
                return;
            this.database[table].splice(i, 1);
            deleted.push(row);
            return;
        });
        return deleted;
    }
    ;
}
;
