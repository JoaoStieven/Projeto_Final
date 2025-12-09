import { createError } from "@ponto-certo/shared/func/error";

export class Password {
    private readonly password: string;
    
    public constructor(pwd: string){
        Password.ensure(pwd);

        this.password = pwd;

        return this;
    }

    public value(){
        return this.password;
    }

    public static ensure(object: any): asserts object is string {
        if(typeof object !== "string") throw Password.Error.INVALID_TYPE;
        if(!/^\w+$/.test(object)) throw Password.Error.INVALID_CHARACTERS;
    }
}

export namespace Password {
    const PasswordError = createError("PasswordError");
    
    export const Error = {
        INVALID_TYPE: PasswordError("Invalid 'Password' conversion: Expected a string"),
        INVALID_CHARACTERS: PasswordError("Invalid 'Password' conversion: Expected a alphanumerical string")
    }
}