import { createError } from "@ponto-certo/shared/func/error";

export class Name {
    private readonly name: string;
    
    public constructor(str: string){
        Name.ensure(str);

        this.name = str;

        return this;
    }

    public value(){
        return this.name;
    }

    public static ensure(object: any): asserts object is string  {
        if(typeof object !== "string") throw Name.Error;
        if(!/^(?:[a-zA-Z]| )+$/.test(object)) throw Name.Error;
    }
}

export namespace Name {
    const NameError = createError("NameError");

    export const Error = {
        INVALID_TYPE: NameError("Invalid 'Name' conversion: Expected a string"),
        INVALID_CHARACTERS: NameError("Invalid 'Name' conversion: Expected a aplhabetical string")
    }
}