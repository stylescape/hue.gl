




import json
from colormath.color_objects import sRGBColor, LCHabColor
from colormath.color_conversions import convert_color
L=[ 90, 82, 74, 66, 58, 50, 42, 34, 26]
C=[12, 18, 24, 30, 36, 30, 24, 18, 12]
res=[]


for i in range(15,361,15):
    row = []
    for j in range(0, len(L)):
        code = "N{}{:03}".format(j+1, i)
        lch = LCHabColor(L[j],C[j],i)
        rgb = convert_color (lch, sRGBColor)
        hex = rgb.get_rgb_hex()
        row.append({"code": code, "hex":hex})
    res.append(row)

    
return json.dumps(res)