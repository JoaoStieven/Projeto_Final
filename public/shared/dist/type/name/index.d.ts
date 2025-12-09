export declare class Name {
    private readonly name;
    constructor(str: string);
    value(): string;
    static ensure(object: any): asserts object is string;
}
export declare namespace Name {
    const Error: {
        INVALID_TYPE: Error;
        INVALID_CHARACTERS: Error;
    };
}
