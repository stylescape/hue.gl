export declare function rgb2cmyk(r: number, g: number, b: number, normalized: any): {
    c: number;
    m: number;
    y: number;
    k: number;
};
export declare function colorToHex(color: {
    toString: (arg0: number) => any;
}): any;
export declare function convertRGBtoHex(red: any, green: any, blue: any): string;
export declare function pad(num: string | any[], size: number, char: any): string;
