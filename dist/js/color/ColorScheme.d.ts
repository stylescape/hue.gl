import { ColorSwatch } from './ColorSwatch.js';
type ColorSchemeConfig = {
    prefix?: string;
    h_step?: number;
    p_count?: number;
    l_l_min?: number;
    l_l_step?: number;
    d_l_step?: number;
    l_c_min?: number;
    l_c_step?: number;
    d_c_step?: number;
};
export declare class ColorScheme {
    config: ColorSchemeConfig | any;
    names: any;
    colorList: ColorSwatch[];
    colorDict: Record<string, Record<string, ColorSwatch>>;
    constructor(config: ColorSchemeConfig, names: any);
    private initializeColors;
    getColorList(): ColorSwatch[];
    getColorDict(): Record<string, Record<string, ColorSwatch>>;
}
export {};
