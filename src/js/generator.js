// Import necessary functions and classes
import Color from 'colorjs.io';
import { convertRGBtoHex, pad } from './util.js';
// const fs = require('fs');

import fs from 'fs/promises';


// ColorSwatch Class
class ColorSwatch {
    constructor(h, c, l, name) {
        if (h < 0 || h > 360 || c < 0 || c > 100 || l < 0 || l > 100) {
            throw new Error("Invalid HCL values");
        }
        this.h = h;
        this.c = c;
        this.l = l;
        this.name = name;
        this.model = new Color("lch", [l, c, h]);
    }

    getRGB() {
        return [0, 0, 0]; // Placeholder, needs real conversion logic
    }

    toString() {
        const [r, g, b] = this.getRGB();
        return `rgb(${r}, ${g}, ${b})`;
    }

    hex() {
        let color = this.model.to("srgb");
        let hex = convertRGBtoHex(
            Math.round(color.coords[0] * 255),
            Math.round(color.coords[1] * 255),
            Math.round(color.coords[2] * 255),
        );
        return hex;
    }
}

// ColorScheme Class
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
        const l_list = [];
        const c_list = [];

        for (let i = 0; i < this.config.p_count; i++) {
            let l_cur = this.config.l_l_min + i * this.config.l_l_step;
            l_list.push(l_cur);
        }

        for (let i = 0; i < l_count; i++) {
            let c_cur = this.config.l_c_min + i * this.config.l_c_step;
            c_list.push(c_cur);
        }

        for (let i = 0; i < d_count; i++) {
            let c_cur = this.config.l_c_min + i * this.config.d_c_step;
            c_list.push(c_cur);
        }

        for (let h = 0; h <= 360; h += this.config.h_step) {
            let h_group = {};
            let h_group_name = this.names[h] || h.toString();

            for (let i = 0; i < this.config.p_count; i++) {
                let l_cur = l_list[i];
                let c_cur = c_list[i];
                let name = this.config.prefix + pad(h.toString(), 3, "0") + (i + 1).toString();
                let color = new ColorSwatch(h, c_cur, l_cur, name);
                this.colorList.push(color);
                h_group[name] = color;
            }

            this.colordict[h_group_name] = h_group;
        }
    }

    getColorList() {
        return this.colorList;
    }

    getColorDict() {
        return this.colorDict;
    }
}

// Configuration and usage
const hueConfig = {
    prefix: "N",
    h_step: 15,
    p_count: 9,
    l_l_min: 96,
    l_l_step: -6,
    d_l_step: -6,
    l_c_min: 12,
    l_c_step: 6,
    d_c_step: -6,
};

const hueNames = {
    0: "Grey",
    15: "Salmon",
    30: "Orange",
    45: "Amber",
    60: "Yellow",        // Fixed
    75: "Lime",
    90: "Ecru",
    105: "Olive",
    120: "Green",         // Fixed
    135: "Forest",
    150: "Jade",
    165: "Mint",
    180: "Cyan",          // Fixed
    195: "Teal",
    210: "Capri",
    225: "Sky",
    240: "Blue",          // Fixed
    255: "Azure",
    270: "Indigo",
    285: "Violet",
    300: "Magenta",       // Fixed
    315: "Purple",
    330: "Rose",
    345: "Pink",
    360: "Red"            // Fixed
};

// const colorScheme = new ColorScheme(hueConfig, hueNames);
// const colorDict = colorScheme.getColorDict();



// Assuming 'colorScheme' and 'ColorScheme' are already defined and set up
const colorScheme = new ColorScheme(hueConfig, hueNames);
const colorDict = colorScheme.getColorDict();

// Convert the colorDict object to a JSON string
const jsonContent = JSON.stringify(colorDict, null, 4); // Beautify the JSON output

// Define the path and filename for the output JSON file
const filePath = '../json/colorDict.json';

// Write the JSON string to a file
fs.writeFile(filePath, jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});
