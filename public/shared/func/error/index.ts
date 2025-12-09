export function createError(name: string){
    return (message: string) => {
        const err = new Error(message);

        err.name = name;
        return err
    };
}