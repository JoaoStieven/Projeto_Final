import { createError } from "@ponto-certo/shared/func/error";

export class ID {
    private readonly id: number;

    public constructor(n: number){
        ID.ensure(n);

        this.id = n;

        return this;
    }

    public value(){
        return this.id;
    }

    public static ensure(object: any): asserts object is number {
        if(typeof object !== "number") throw ID.Error.INVALID_TYPE;
        if(Number.isNaN(object)) throw ID.Error.IS_NOT_A_NUMBER;
        if(object <= 0) throw ID.Error.IS_NOT_POSITIVE;
    }
}

export namespace ID {
    const IdError = createError("IdError");

    export const Error = {
        INVALID_TYPE: IdError("Invalid 'ID' conversion: Expected a number"),
        IS_NOT_A_NUMBER: IdError("Invalid 'ID' conversion: NaN was not expected"),
        IS_NOT_POSITIVE: IdError("Invalid 'ID' conversion: Expected a positive number")
    }
}