export declare class ID {
    private readonly id;
    constructor(n: number);
    value(): number;
    static ensure(object: any): asserts object is number;
}
export declare namespace ID {
    const Error: {
        INVALID_TYPE: Error;
        IS_NOT_A_NUMBER: Error;
        IS_NOT_POSITIVE: Error;
    };
}
