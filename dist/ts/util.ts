
export function rgb2cmyk(r: number, g: number, b: number, normalized: boolean = false) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);

    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);

    if (!normalized) {
        c = Math.round(c * 10000) / 100;
        m = Math.round(m * 10000) / 100;
        y = Math.round(y * 10000) / 100;
        k = Math.round(k * 10000) / 100;
    }

    // Pure black divides 0 by 0 above
    c = isNaN(c) ? 0 : c;
    m = isNaN(m) ? 0 : m;
    y = isNaN(y) ? 0 : y;
    k = isNaN(k) ? 0 : k;

    return {
        c: c,
        m: m,
        y: y,
        k: k
    }
}

export function colorToHex(color: number): string {
    const channel = Math.round(Math.min(Math.max(color, 0), 255));
    return channel.toString(16).padStart(2, "0");
}


export function convertRGBtoHex(red: number, green: number, blue: number): string {
    return "#" + colorToHex(red) + colorToHex(green) + colorToHex(blue);
}


export function pad(num: string | number, size: number, char: string): string {
    return num.toString().padStart(size, char);
}
