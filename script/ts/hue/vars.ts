// Color Variables
// ----------------------------------------------------------------

const p_count =  9;
const l_count =  Math.ceil(p_count / 2);
const d_count =  Math.floor(p_count / 2);

// L Variables
const l_l_min     =  96;
const l_l_step    =  -6;
const d_l_step    =  -6;
const d_l_min     =  l_l_min + (l_l_step * (l_count-1));
console.log(d_l_min)

// C Variables
const l_c_min     =  12;
const l_c_step    =  +6;
const d_c_step    =  -6;
const d_c_min     =  l_c_min + (l_c_step * (l_count-1));

// H Variables
const h_max     = 360;
const h_step    =  15;
const h_min     =  h_step;
