"use strict";
// Copyright 2024 Scape Agency BV
Object.defineProperty(exports, "__esModule", { value: true });
exports.hue_rgb = exports.hue_hcl = exports.hue_hex = exports.hueNames = exports.hueConfig = exports.ColorSwatch = exports.ColorScheme = exports.ColorPicker = void 0;
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var color_1 = require("./color");
Object.defineProperty(exports, "ColorPicker", { enumerable: true, get: function () { return color_1.ColorPicker; } });
Object.defineProperty(exports, "ColorScheme", { enumerable: true, get: function () { return color_1.ColorScheme; } });
Object.defineProperty(exports, "ColorSwatch", { enumerable: true, get: function () { return color_1.ColorSwatch; } });
var config_1 = require("./config");
Object.defineProperty(exports, "hueConfig", { enumerable: true, get: function () { return config_1.hueConfig; } });
Object.defineProperty(exports, "hueNames", { enumerable: true, get: function () { return config_1.hueNames; } });
var constants_1 = require("./constants");
Object.defineProperty(exports, "hue_hex", { enumerable: true, get: function () { return constants_1.hue_hex; } });
Object.defineProperty(exports, "hue_hcl", { enumerable: true, get: function () { return constants_1.hue_hcl; } });
Object.defineProperty(exports, "hue_rgb", { enumerable: true, get: function () { return constants_1.hue_rgb; } });
