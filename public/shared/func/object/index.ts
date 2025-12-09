export function toCamelcase(str: string){
    return str.replace(/_(\w+)/g, char => char[1].toUpperCase());
}

export function toSnakecase(str: string){
    return str.replace(/([A-Z])/g, char => "_" + char.toLowerCase());
}

export function toCamelcaseObject(obj: { [x: string]: any }){
    const newObj: { [x: string]: any } = {};

    Object.keys(obj).forEach(key => newObj[toCamelcase(key)] = obj[key]);

    return newObj;
}

export function toSnakecaseObject(obj: { [x: string]: any }){
    const newObj: { [x: string]: any } = {};

    Object.keys(obj).forEach(key => newObj[toSnakecase(key)] = obj[key]);

    return newObj;
}