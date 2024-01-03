// script/class/class/DirectoryCleaner.ts

// Copyright 2023 Scape Agency BV

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// ============================================================================
// Import
// ============================================================================

import ColorSwatch from './ColorSwatch.js';
import { pad } from '../util.js';


// ============================================================================
// Types
// ============================================================================

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


// ============================================================================
// Classes
// ============================================================================

class ColorScheme {

    private config: ColorSchemeConfig | any;
    private names: any;
    private colorList: ColorSwatch[];
    private colorDict: Record<string, Record<string, ColorSwatch>>;

    constructor(config: ColorSchemeConfig, names: any) {
        // Initialize colorList and other properties based on config
        this.config = config;
        this.names = names;
        this.colorList = [];
        this.colorDict = {};
        this.initializeColors();
    }

    private initializeColors(): void {
        // Logic to initialize colorList based on the provided configuration

        const l_count = Math.ceil(this.config.p_count / 2);
        const d_count = Math.floor(this.config.p_count / 2);
        const d_l_min = this.config.l_l_min + (this.config.l_l_step * (l_count-1));
        const d_c_min = this.config.l_c_min + (this.config.l_c_step * (l_count-1));

        // Create LC lists
        // --------------------------------------------------------------------
        const l_list  = [];
        const c_list  = [];
        for (let i = 0; i < this.config.p_count; i ++) {
            let l_cur = this.config.l_l_min + this.config.l_l_step + i * this.config.l_l_step -2*i;
            l_list.push(l_cur);
        };
        for (let i = 0; i < l_count; i ++) {
            let c_cur = this.config.l_c_min + i * this.config.l_c_step;
            c_list.push(c_cur);
        };
        for (let i = 0; i < d_count; i ++) {
            let c_cur = d_c_min + this.config.d_c_step + i *this.config.d_c_step;
            c_list.push(c_cur);
        };

        // Create hue.gl
        // --------------------------------------------------------------------
        for (let h = this.config.h_step; h <= 360; h += this.config.h_step) {

            let h_group: Record<string, ColorSwatch> = {};
            // let h_group_name = h.toString();
            let h_group_name = this.names[h];;

            for (let i = 0; i < this.config.p_count; i ++) {
                let l_cur = l_list[i];
                let c_cur = c_list[i];
                let name = this.config.prefix + pad(h.toString(), 3, "0") + (i + 1).toString();
                let color = new ColorSwatch(h, c_cur, l_cur, name)
                this.colorList.push(color);
                h_group[name] = color;
            };

            this.colorDict[h_group_name] = h_group;

        }
    }

    public getColorList(): ColorSwatch[] {
        return this.colorList;
    }

    public getColorDict(): Record<string, Record<string, ColorSwatch>> {
        return this.colorDict;
    }

}


// ============================================================================
// Export
// ============================================================================

export default ColorScheme;
