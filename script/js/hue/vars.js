"use strict";
function initializeColorVariables() {
    const p_count = 9;
    const l_count = Math.ceil(p_count / 2);
    const d_count = Math.floor(p_count / 2);
    const l_l_min = 96;
    const l_l_step = -6;
    const d_l_step = -6;
    const d_l_min = l_l_min + (l_l_step * (l_count - 1));
    const l_c_min = 12;
    const l_c_step = 6;
    const d_c_step = -6;
    const d_c_min = l_c_min + (l_c_step * (l_count - 1));
    const h_max = 360;
    const h_step = 15;
    const h_min = h_step;
    return { p_count, l_count, d_count, l_l_min, l_l_step, d_l_step, d_l_min, l_c_min, l_c_step, d_c_step, d_c_min, h_max, h_step, h_min };
}
//# sourceMappingURL=vars.js.map