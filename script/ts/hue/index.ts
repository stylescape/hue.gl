










// Create LC lists
// ----------------------------------------------------------------
var l_list  = [];
var c_list  = [];
for (let i = 0; i < l_count; i ++) {
    let c_cur = l_c_min + i * l_c_step;
    c_list.push(c_cur);
};
for (let i = 0; i < d_count; i ++) {
    let c_cur = d_c_min + d_c_step + i * d_c_step;
    c_list.push(c_cur);
};
for (let i = 0; i < p_count; i ++) {
    let l_cur = l_l_min + l_l_step + i * l_l_step -2*i;
    l_list.push(l_cur);
};
