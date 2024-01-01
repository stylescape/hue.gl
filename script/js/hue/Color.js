class Color {
    constructor(h, c, l, name) {
        this.h = 0;
        this.c = 0;
        this.l = 0;
        this.setHCL(h, c, l);
        this.name = name;
    }
    setHCL(h, c, l) {
        if (h < 0 || h > 360 || c < 0 || c > 100 || l < 0 || l > 100) {
            throw new Error("Invalid HCL values");
        }
        this.h = h;
        this.c = c;
        this.l = l;
    }
    getHCL() {
        return [this.h, this.c, this.l];
    }
    getName() {
        return this.name;
    }
    getRGB() {
        return [0, 0, 0];
    }
    toString() {
        const [r, g, b] = this.getRGB();
        return `rgb(${r}, ${g}, ${b})`;
    }
    toDict() {
        return {
            name: this.name,
            hcl_h: this.h,
            hcl_c: this.c,
            hcl_l: this.l,
        };
    }
}
export default Color;
//# sourceMappingURL=Color.js.map