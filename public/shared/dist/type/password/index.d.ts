export declare class Password {
    private readonly password;
    constructor(pwd: string);
    value(): string;
    static ensure(object: any): asserts object is string;
}
export declare namespace Password {
    const Error: {
        INVALID_TYPE: Error;
        INVALID_CHARACTERS: Error;
    };
}
