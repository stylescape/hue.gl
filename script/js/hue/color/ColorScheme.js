import ColorSwatch from './ColorSwatch.js';
import { pad } from '../util.js';
class ColorScheme {
    constructor(config, names) {
        this.config = config;
        this.names = names;
        this.colorList = [];
        this.colorDict = {};
        this.initializeColors();
    }
    initializeColors() {
        const l_count = Math.ceil(this.config.p_count / 2);
        const d_count = Math.floor(this.config.p_count / 2);
        const d_l_min = this.config.l_l_min + (this.config.l_l_step * (l_count - 1));
        const d_c_min = this.config.l_c_min + (this.config.l_c_step * (l_count - 1));
        const l_list = [];
        const c_list = [];
        for (let i = 0; i < this.config.p_count; i++) {
            let l_cur = this.config.l_l_min + this.config.l_l_step + i * this.config.l_l_step - 2 * i;
            l_list.push(l_cur);
        }
        ;
        for (let i = 0; i < l_count; i++) {
            let c_cur = this.config.l_c_min + i * this.config.l_c_step;
            c_list.push(c_cur);
        }
        ;
        for (let i = 0; i < d_count; i++) {
            let c_cur = d_c_min + this.config.d_c_step + i * this.config.d_c_step;
            c_list.push(c_cur);
        }
        ;
        for (let h = this.config.h_step; h <= 360; h += this.config.h_step) {
            let h_group = {};
            let h_group_name = this.names[h];
            ;
            for (let i = 0; i < this.config.p_count; i++) {
                let l_cur = l_list[i];
                let c_cur = c_list[i];
                let name = this.config.prefix + pad(h.toString(), 3, "0") + (i + 1).toString();
                let color = new ColorSwatch(h, c_cur, l_cur, name);
                this.colorList.push(color);
                h_group[name] = color;
            }
            ;
            this.colorDict[h_group_name] = h_group;
        }
    }
    getColorList() {
        return this.colorList;
    }
    getColorDict() {
        return this.colorDict;
    }
}
export default ColorScheme;
//# sourceMappingURL=ColorScheme.js.map