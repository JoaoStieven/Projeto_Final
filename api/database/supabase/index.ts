import type { Database, Entry, Primitive } from "@ponto-certo/api/contract/database";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@supabase/supabase-js";

export class SupabaseDatabase implements Database {
    private readonly database: SupabaseClient;
    
    public constructor(url: string, key: string){
        this.database = createClient(url, key);

        return this;
    }

    public async select(table: string, params: [string, Primitive | null][] = []): Promise<Entry[] | Error> {
        const queryStart = this.database.from(table).select("*");
        const queryArray = [queryStart];

        params.forEach(([column, value], i) => {
            if(i === 0){
                queryArray[i] = !value ? queryStart : queryStart.eq(column, value);

                return;
            };

            queryArray[i] = !value ? queryArray[i - 1] : queryArray[i - 1].eq(column, value);
        });

        const query = queryArray[queryArray.length - 1];
        
        const { data, error } = await query;

        if(error) return error as Error;

        return data;
    }

    public async insert(table: string, value: Entry): Promise<Entry | Error> {
        const { data, error } = await this.database
            .from(table)
            .insert(value)
            .select()
            .single();

        if(error) return error as Error;

        return data;
    }

    public async update(table: string, value: Entry, params: [string, Primitive | null][] = []): Promise<Entry[] | Error> {
        const queryStart = this.database.from(table).update(value);
        const queryArray = [queryStart];

        params.forEach(([column, value], i) => {
            if(i === 0){
                queryArray[i] = !value ? queryStart : queryStart.eq(column, value);

                return;
            };

            queryArray[i] = !value ? queryArray[i - 1] : queryArray[i - 1].eq(column, value);
        });

        const query = queryArray[queryArray.length - 1];

        const { data, error } = await query.select();

        if(error) return error as Error;

        return data;
    }

    public async delete(table: string, params: [string, Primitive | null][] = []): Promise<Entry[] | Error> {
        const queryStart = this.database.from(table).delete();
        const queryArray = [queryStart];

        params.forEach(([column, value], i) => {
            if(i === 0){
                queryArray[i] = !value ? queryStart : queryStart.eq(column, value);

                return;
            };

            queryArray[i] = !value ? queryArray[i - 1] : queryArray[i - 1].eq(column, value);
        });

        const query = queryArray[queryArray.length - 1];

        const { data, error } = await query.select();

        if(error) return error as Error;

        return data;
    }
}