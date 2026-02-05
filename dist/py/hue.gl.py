# -*- coding: utf-8 -*-
"""
hue.gl - Perceptual Colour System for Python

hue.gl
Version: 0.1.1

A perceptually uniform color palette with 25 hues and 9 shades each.
Colors are generated using the LCH color space for consistent visual perception.

Copyright (c) 2023-2026 Scape Agency BV
Licensed under the MIT License
https://github.com/stylescape/hue.gl

Example usage:
    from hue_gl import HueGL, colors

    # Access colors by name
    print(colors['Grey']['N0001'])  # Light grey
    print(colors['Blue']['N2405'])  # Mid blue

    # Or use the HueGL class
    palette = HueGL()
    blue = palette.get_color('Blue', 5)
    print(blue.hex)  # Hex value
    print(blue.rgb)  # RGB tuple
"""

from __future__ import annotations
from typing import Dict, Tuple, NamedTuple, Optional
from dataclasses import dataclass


__version__ = "0.1.1"
__all__ = ["HueGL", "Color", "colors", "HUE_NAMES"]


# =============================================================================
# Type Definitions
# =============================================================================

class RGB(NamedTuple):
    """RGB color representation (0-255 range)."""
    r: int
    g: int
    b: int


class HCL(NamedTuple):
    """HCL color representation (Hue, Chroma, Luminance)."""
    h: float
    c: float
    l: float


# =============================================================================
# Color Data Class
# =============================================================================

@dataclass(frozen=True)
class Color:
    """
    Represents a single color in the hue.gl palette.

    Attributes:
        name: The color identifier (e.g., 'N1201')
        hue_name: The hue group name (e.g., 'Green')
        rgb: RGB values as a tuple (0-255 range)
        hcl: HCL values as a tuple
        hex: Hexadecimal color string
    """
    name: str
    hue_name: str
    rgb: RGB
    hcl: HCL
    hex: str

    def __str__(self) -> str:
        return self.hex

    def __repr__(self) -> str:
        return f"Color(name='{self.name}', hex='{self.hex}')"

    @property
    def css_rgb(self) -> str:
        """Returns CSS rgb() format."""
        return f"rgb({self.rgb.r}, {self.rgb.g}, {self.rgb.b})"

    @property
    def css_hsl(self) -> str:
        """Returns CSS hsl() format (approximate)."""
        # Convert HCL to HSL approximation
        h = self.hcl.h
        l = self.hcl.l
        s = min(100, self.hcl.c * 1.5)  # Approximate saturation
        return f"hsl({h:.0f}, {s:.0f}%, {l:.0f}%)"


# =============================================================================
# Hue Names Mapping
# =============================================================================

HUE_NAMES: Dict[int, str] = {
    0: "Grey",
    15: "Salmon",
    30: "Orange",
    45: "Amber",
    60: "Yellow",
    75: "Lime",
    90: "Ecru",
    105: "Olive",
    120: "Green",
    135: "Forest",
    150: "Jade",
    165: "Mint",
    180: "Cyan",
    195: "Teal",
    210: "Capri",
    225: "Sky",
    240: "Blue",
    255: "Azure",
    270: "Indigo",
    285: "Violet",
    300: "Magenta",
    315: "Purple",
    330: "Rose",
    345: "Pink",
    360: "Red",
}


# =============================================================================
# Color Definitions
# =============================================================================

# Color palette dictionary: { hue_name: { color_name: Color } }
colors: Dict[str, Dict[str, Color]] = {}

# Grey
# -----------------------------------------------------------------------------
colors["Grey"] = {    "N0001": Color(
        name="N0001",
        hue_name="Grey",
        rgb=RGB(226, 226, 226),
        hcl=HCL(0, 0, 90),
        hex="#e2e2e2",
    ),    "N0002": Color(
        name="N0002",
        hue_name="Grey",
        rgb=RGB(204, 204, 204),
        hcl=HCL(0, 0, 82),
        hex="#cccccc",
    ),    "N0003": Color(
        name="N0003",
        hue_name="Grey",
        rgb=RGB(182, 182, 182),
        hcl=HCL(0, 0, 74),
        hex="#b6b6b6",
    ),    "N0004": Color(
        name="N0004",
        hue_name="Grey",
        rgb=RGB(160, 160, 160),
        hcl=HCL(0, 0, 66),
        hex="#a0a0a0",
    ),    "N0005": Color(
        name="N0005",
        hue_name="Grey",
        rgb=RGB(139, 139, 139),
        hcl=HCL(0, 0, 58),
        hex="#8b8b8b",
    ),    "N0006": Color(
        name="N0006",
        hue_name="Grey",
        rgb=RGB(119, 119, 119),
        hcl=HCL(0, 0, 50),
        hex="#777777",
    ),    "N0007": Color(
        name="N0007",
        hue_name="Grey",
        rgb=RGB(99, 99, 99),
        hcl=HCL(0, 0, 42),
        hex="#636363",
    ),    "N0008": Color(
        name="N0008",
        hue_name="Grey",
        rgb=RGB(80, 80, 80),
        hcl=HCL(0, 0, 34),
        hex="#505050",
    ),    "N0009": Color(
        name="N0009",
        hue_name="Grey",
        rgb=RGB(62, 62, 62),
        hcl=HCL(0, 0, 26),
        hex="#3e3e3e",
    ),}

# Salmon
# -----------------------------------------------------------------------------
colors["Salmon"] = {    "N0151": Color(
        name="N0151",
        hue_name="Salmon",
        rgb=RGB(250, 219, 221),
        hcl=HCL(15, 12, 90),
        hex="#fadbdd",
    ),    "N0152": Color(
        name="N0152",
        hue_name="Salmon",
        rgb=RGB(238, 192, 196),
        hcl=HCL(15, 18, 82),
        hex="#eec0c4",
    ),    "N0153": Color(
        name="N0153",
        hue_name="Salmon",
        rgb=RGB(226, 166, 172),
        hcl=HCL(15, 24, 74),
        hex="#e2a6ac",
    ),    "N0154": Color(
        name="N0154",
        hue_name="Salmon",
        rgb=RGB(212, 140, 148),
        hcl=HCL(15, 30, 66),
        hex="#d48c94",
    ),    "N0155": Color(
        name="N0155",
        hue_name="Salmon",
        rgb=RGB(198, 114, 125),
        hcl=HCL(15, 36, 58),
        hex="#c6727d",
    ),    "N0156": Color(
        name="N0156",
        hue_name="Salmon",
        rgb=RGB(167, 99, 107),
        hcl=HCL(15, 30, 50),
        hex="#a7636b",
    ),    "N0157": Color(
        name="N0157",
        hue_name="Salmon",
        rgb=RGB(137, 84, 90),
        hcl=HCL(15, 24, 42),
        hex="#89545a",
    ),    "N0158": Color(
        name="N0158",
        hue_name="Salmon",
        rgb=RGB(107, 69, 73),
        hcl=HCL(15, 18, 34),
        hex="#6b4549",
    ),    "N0159": Color(
        name="N0159",
        hue_name="Salmon",
        rgb=RGB(79, 55, 57),
        hcl=HCL(15, 12, 26),
        hex="#4f3739",
    ),}

# Orange
# -----------------------------------------------------------------------------
colors["Orange"] = {    "N0301": Color(
        name="N0301",
        hue_name="Orange",
        rgb=RGB(250, 219, 215),
        hcl=HCL(30, 12, 90),
        hex="#fadbd7",
    ),    "N0302": Color(
        name="N0302",
        hue_name="Orange",
        rgb=RGB(237, 193, 188),
        hcl=HCL(30, 18, 82),
        hex="#edc1bc",
    ),    "N0303": Color(
        name="N0303",
        hue_name="Orange",
        rgb=RGB(224, 168, 161),
        hcl=HCL(30, 24, 74),
        hex="#e0a8a1",
    ),    "N0304": Color(
        name="N0304",
        hue_name="Orange",
        rgb=RGB(210, 142, 135),
        hcl=HCL(30, 30, 66),
        hex="#d28e87",
    ),    "N0305": Color(
        name="N0305",
        hue_name="Orange",
        rgb=RGB(196, 117, 110),
        hcl=HCL(30, 36, 58),
        hex="#c4756e",
    ),    "N0306": Color(
        name="N0306",
        hue_name="Orange",
        rgb=RGB(165, 101, 95),
        hcl=HCL(30, 30, 50),
        hex="#a5655f",
    ),    "N0307": Color(
        name="N0307",
        hue_name="Orange",
        rgb=RGB(135, 86, 80),
        hcl=HCL(30, 24, 42),
        hex="#875650",
    ),    "N0308": Color(
        name="N0308",
        hue_name="Orange",
        rgb=RGB(107, 70, 66),
        hcl=HCL(30, 18, 34),
        hex="#6b4642",
    ),    "N0309": Color(
        name="N0309",
        hue_name="Orange",
        rgb=RGB(79, 56, 53),
        hcl=HCL(30, 12, 26),
        hex="#4f3835",
    ),}

# Amber
# -----------------------------------------------------------------------------
colors["Amber"] = {    "N0451": Color(
        name="N0451",
        hue_name="Amber",
        rgb=RGB(248, 220, 211),
        hcl=HCL(45, 12, 90),
        hex="#f8dcd3",
    ),    "N0452": Color(
        name="N0452",
        hue_name="Amber",
        rgb=RGB(234, 195, 181),
        hcl=HCL(45, 18, 82),
        hex="#eac3b5",
    ),    "N0453": Color(
        name="N0453",
        hue_name="Amber",
        rgb=RGB(220, 170, 152),
        hcl=HCL(45, 24, 74),
        hex="#dcaa98",
    ),    "N0454": Color(
        name="N0454",
        hue_name="Amber",
        rgb=RGB(205, 146, 124),
        hcl=HCL(45, 30, 66),
        hex="#cd927c",
    ),    "N0455": Color(
        name="N0455",
        hue_name="Amber",
        rgb=RGB(190, 121, 96),
        hcl=HCL(45, 36, 58),
        hex="#be7960",
    ),    "N0456": Color(
        name="N0456",
        hue_name="Amber",
        rgb=RGB(160, 105, 84),
        hcl=HCL(45, 30, 50),
        hex="#a06954",
    ),    "N0457": Color(
        name="N0457",
        hue_name="Amber",
        rgb=RGB(132, 88, 72),
        hcl=HCL(45, 24, 42),
        hex="#845848",
    ),    "N0458": Color(
        name="N0458",
        hue_name="Amber",
        rgb=RGB(104, 72, 60),
        hcl=HCL(45, 18, 34),
        hex="#68483c",
    ),    "N0459": Color(
        name="N0459",
        hue_name="Amber",
        rgb=RGB(77, 57, 49),
        hcl=HCL(45, 12, 26),
        hex="#4d3931",
    ),}

# Yellow
# -----------------------------------------------------------------------------
colors["Yellow"] = {    "N0601": Color(
        name="N0601",
        hue_name="Yellow",
        rgb=RGB(244, 222, 207),
        hcl=HCL(60, 12, 90),
        hex="#f4decf",
    ),    "N0602": Color(
        name="N0602",
        hue_name="Yellow",
        rgb=RGB(229, 198, 175),
        hcl=HCL(60, 18, 82),
        hex="#e5c6af",
    ),    "N0603": Color(
        name="N0603",
        hue_name="Yellow",
        rgb=RGB(213, 173, 144),
        hcl=HCL(60, 24, 74),
        hex="#d5ad90",
    ),    "N0604": Color(
        name="N0604",
        hue_name="Yellow",
        rgb=RGB(197, 150, 114),
        hcl=HCL(60, 30, 66),
        hex="#c59672",
    ),    "N0605": Color(
        name="N0605",
        hue_name="Yellow",
        rgb=RGB(181, 127, 85),
        hcl=HCL(60, 36, 58),
        hex="#b57f55",
    ),    "N0606": Color(
        name="N0606",
        hue_name="Yellow",
        rgb=RGB(153, 109, 75),
        hcl=HCL(60, 30, 50),
        hex="#996d4b",
    ),    "N0607": Color(
        name="N0607",
        hue_name="Yellow",
        rgb=RGB(126, 91, 65),
        hcl=HCL(60, 24, 42),
        hex="#7e5b41",
    ),    "N0608": Color(
        name="N0608",
        hue_name="Yellow",
        rgb=RGB(100, 74, 56),
        hcl=HCL(60, 18, 34),
        hex="#644a38",
    ),    "N0609": Color(
        name="N0609",
        hue_name="Yellow",
        rgb=RGB(74, 58, 46),
        hcl=HCL(60, 12, 26),
        hex="#4a3a2e",
    ),}

# Lime
# -----------------------------------------------------------------------------
colors["Lime"] = {    "N0751": Color(
        name="N0751",
        hue_name="Lime",
        rgb=RGB(239, 224, 204),
        hcl=HCL(75, 12, 90),
        hex="#efe0cc",
    ),    "N0752": Color(
        name="N0752",
        hue_name="Lime",
        rgb=RGB(222, 200, 172),
        hcl=HCL(75, 18, 82),
        hex="#dec8ac",
    ),    "N0753": Color(
        name="N0753",
        hue_name="Lime",
        rgb=RGB(205, 177, 140),
        hcl=HCL(75, 24, 74),
        hex="#cdb18c",
    ),    "N0754": Color(
        name="N0754",
        hue_name="Lime",
        rgb=RGB(187, 155, 108),
        hcl=HCL(75, 30, 66),
        hex="#bb9b6c",
    ),    "N0755": Color(
        name="N0755",
        hue_name="Lime",
        rgb=RGB(169, 133, 78),
        hcl=HCL(75, 36, 58),
        hex="#a9854e",
    ),    "N0756": Color(
        name="N0756",
        hue_name="Lime",
        rgb=RGB(143, 113, 69),
        hcl=HCL(75, 30, 50),
        hex="#8f7145",
    ),    "N0757": Color(
        name="N0757",
        hue_name="Lime",
        rgb=RGB(118, 95, 61),
        hcl=HCL(75, 24, 42),
        hex="#765f3d",
    ),    "N0758": Color(
        name="N0758",
        hue_name="Lime",
        rgb=RGB(94, 77, 52),
        hcl=HCL(75, 18, 34),
        hex="#5e4d34",
    ),    "N0759": Color(
        name="N0759",
        hue_name="Lime",
        rgb=RGB(71, 60, 44),
        hcl=HCL(75, 12, 26),
        hex="#473c2c",
    ),}

# Ecru
# -----------------------------------------------------------------------------
colors["Ecru"] = {    "N0901": Color(
        name="N0901",
        hue_name="Ecru",
        rgb=RGB(234, 226, 203),
        hcl=HCL(90, 12, 90),
        hex="#eae2cb",
    ),    "N0902": Color(
        name="N0902",
        hue_name="Ecru",
        rgb=RGB(214, 203, 170),
        hcl=HCL(90, 18, 82),
        hex="#d6cbaa",
    ),    "N0903": Color(
        name="N0903",
        hue_name="Ecru",
        rgb=RGB(194, 181, 138),
        hcl=HCL(90, 24, 74),
        hex="#c2b58a",
    ),    "N0904": Color(
        name="N0904",
        hue_name="Ecru",
        rgb=RGB(175, 159, 106),
        hcl=HCL(90, 30, 66),
        hex="#af9f6a",
    ),    "N0905": Color(
        name="N0905",
        hue_name="Ecru",
        rgb=RGB(155, 138, 75),
        hcl=HCL(90, 36, 58),
        hex="#9b8a4b",
    ),    "N0906": Color(
        name="N0906",
        hue_name="Ecru",
        rgb=RGB(132, 118, 67),
        hcl=HCL(90, 30, 50),
        hex="#847643",
    ),    "N0907": Color(
        name="N0907",
        hue_name="Ecru",
        rgb=RGB(109, 98, 59),
        hcl=HCL(90, 24, 42),
        hex="#6d623b",
    ),    "N0908": Color(
        name="N0908",
        hue_name="Ecru",
        rgb=RGB(88, 79, 51),
        hcl=HCL(90, 18, 34),
        hex="#584f33",
    ),    "N0909": Color(
        name="N0909",
        hue_name="Ecru",
        rgb=RGB(67, 61, 43),
        hcl=HCL(90, 12, 26),
        hex="#433d2b",
    ),}

# Olive
# -----------------------------------------------------------------------------
colors["Olive"] = {    "N1051": Color(
        name="N1051",
        hue_name="Olive",
        rgb=RGB(227, 228, 204),
        hcl=HCL(105, 12, 90),
        hex="#e3e4cc",
    ),    "N1052": Color(
        name="N1052",
        hue_name="Olive",
        rgb=RGB(205, 206, 171),
        hcl=HCL(105, 18, 82),
        hex="#cdceab",
    ),    "N1053": Color(
        name="N1053",
        hue_name="Olive",
        rgb=RGB(183, 185, 139),
        hcl=HCL(105, 24, 74),
        hex="#b7b98b",
    ),    "N1054": Color(
        name="N1054",
        hue_name="Olive",
        rgb=RGB(161, 164, 107),
        hcl=HCL(105, 30, 66),
        hex="#a1a46b",
    ),    "N1055": Color(
        name="N1055",
        hue_name="Olive",
        rgb=RGB(139, 143, 76),
        hcl=HCL(105, 36, 58),
        hex="#8b8f4c",
    ),    "N1056": Color(
        name="N1056",
        hue_name="Olive",
        rgb=RGB(119, 122, 68),
        hcl=HCL(105, 30, 50),
        hex="#777a44",
    ),    "N1057": Color(
        name="N1057",
        hue_name="Olive",
        rgb=RGB(99, 102, 60),
        hcl=HCL(105, 24, 42),
        hex="#63663c",
    ),    "N1058": Color(
        name="N1058",
        hue_name="Olive",
        rgb=RGB(80, 82, 52),
        hcl=HCL(105, 18, 34),
        hex="#505234",
    ),    "N1059": Color(
        name="N1059",
        hue_name="Olive",
        rgb=RGB(62, 63, 44),
        hcl=HCL(105, 12, 26),
        hex="#3e3f2c",
    ),}

# Green
# -----------------------------------------------------------------------------
colors["Green"] = {    "N1201": Color(
        name="N1201",
        hue_name="Green",
        rgb=RGB(221, 230, 206),
        hcl=HCL(120, 12, 90),
        hex="#dde6ce",
    ),    "N1202": Color(
        name="N1202",
        hue_name="Green",
        rgb=RGB(196, 209, 174),
        hcl=HCL(120, 18, 82),
        hex="#c4d1ae",
    ),    "N1203": Color(
        name="N1203",
        hue_name="Green",
        rgb=RGB(171, 188, 143),
        hcl=HCL(120, 24, 74),
        hex="#abbc8f",
    ),    "N1204": Color(
        name="N1204",
        hue_name="Green",
        rgb=RGB(146, 168, 112),
        hcl=HCL(120, 30, 66),
        hex="#92a870",
    ),    "N1205": Color(
        name="N1205",
        hue_name="Green",
        rgb=RGB(122, 148, 83),
        hcl=HCL(120, 36, 58),
        hex="#7a9453",
    ),    "N1206": Color(
        name="N1206",
        hue_name="Green",
        rgb=RGB(105, 126, 73),
        hcl=HCL(120, 30, 50),
        hex="#697e49",
    ),    "N1207": Color(
        name="N1207",
        hue_name="Green",
        rgb=RGB(88, 104, 64),
        hcl=HCL(120, 24, 42),
        hex="#586840",
    ),    "N1208": Color(
        name="N1208",
        hue_name="Green",
        rgb=RGB(72, 84, 55),
        hcl=HCL(120, 18, 34),
        hex="#485437",
    ),    "N1209": Color(
        name="N1209",
        hue_name="Green",
        rgb=RGB(57, 64, 45),
        hcl=HCL(120, 12, 26),
        hex="#39402d",
    ),}

# Forest
# -----------------------------------------------------------------------------
colors["Forest"] = {    "N1351": Color(
        name="N1351",
        hue_name="Forest",
        rgb=RGB(215, 231, 210),
        hcl=HCL(135, 12, 90),
        hex="#d7e7d2",
    ),    "N1352": Color(
        name="N1352",
        hue_name="Forest",
        rgb=RGB(187, 211, 179),
        hcl=HCL(135, 18, 82),
        hex="#bbd3b3",
    ),    "N1353": Color(
        name="N1353",
        hue_name="Forest",
        rgb=RGB(159, 191, 150),
        hcl=HCL(135, 24, 74),
        hex="#9fbf96",
    ),    "N1354": Color(
        name="N1354",
        hue_name="Forest",
        rgb=RGB(131, 171, 121),
        hcl=HCL(135, 30, 66),
        hex="#83ab79",
    ),    "N1355": Color(
        name="N1355",
        hue_name="Forest",
        rgb=RGB(104, 151, 93),
        hcl=HCL(135, 36, 58),
        hex="#68975d",
    ),    "N1356": Color(
        name="N1356",
        hue_name="Forest",
        rgb=RGB(90, 129, 81),
        hcl=HCL(135, 30, 50),
        hex="#5a8151",
    ),    "N1357": Color(
        name="N1357",
        hue_name="Forest",
        rgb=RGB(77, 107, 70),
        hcl=HCL(135, 24, 42),
        hex="#4d6b46",
    ),    "N1358": Color(
        name="N1358",
        hue_name="Forest",
        rgb=RGB(64, 85, 59),
        hcl=HCL(135, 18, 34),
        hex="#40553b",
    ),    "N1359": Color(
        name="N1359",
        hue_name="Forest",
        rgb=RGB(52, 65, 48),
        hcl=HCL(135, 12, 26),
        hex="#344130",
    ),}

# Jade
# -----------------------------------------------------------------------------
colors["Jade"] = {    "N1501": Color(
        name="N1501",
        hue_name="Jade",
        rgb=RGB(209, 232, 214),
        hcl=HCL(150, 12, 90),
        hex="#d1e8d6",
    ),    "N1502": Color(
        name="N1502",
        hue_name="Jade",
        rgb=RGB(178, 212, 186),
        hcl=HCL(150, 18, 82),
        hex="#b2d4ba",
    ),    "N1503": Color(
        name="N1503",
        hue_name="Jade",
        rgb=RGB(147, 193, 159),
        hcl=HCL(150, 24, 74),
        hex="#93c19f",
    ),    "N1504": Color(
        name="N1504",
        hue_name="Jade",
        rgb=RGB(116, 173, 132),
        hcl=HCL(150, 30, 66),
        hex="#74ad84",
    ),    "N1505": Color(
        name="N1505",
        hue_name="Jade",
        rgb=RGB(85, 154, 106),
        hcl=HCL(150, 36, 58),
        hex="#559a6a",
    ),    "N1506": Color(
        name="N1506",
        hue_name="Jade",
        rgb=RGB(75, 131, 92),
        hcl=HCL(150, 30, 50),
        hex="#4b835c",
    ),    "N1507": Color(
        name="N1507",
        hue_name="Jade",
        rgb=RGB(66, 108, 78),
        hcl=HCL(150, 24, 42),
        hex="#426c4e",
    ),    "N1508": Color(
        name="N1508",
        hue_name="Jade",
        rgb=RGB(57, 87, 65),
        hcl=HCL(150, 18, 34),
        hex="#395741",
    ),    "N1509": Color(
        name="N1509",
        hue_name="Jade",
        rgb=RGB(47, 66, 52),
        hcl=HCL(150, 12, 26),
        hex="#2f4234",
    ),}

# Mint
# -----------------------------------------------------------------------------
colors["Mint"] = {    "N1651": Color(
        name="N1651",
        hue_name="Mint",
        rgb=RGB(205, 233, 220),
        hcl=HCL(165, 12, 90),
        hex="#cde9dc",
    ),    "N1652": Color(
        name="N1652",
        hue_name="Mint",
        rgb=RGB(171, 214, 194),
        hcl=HCL(165, 18, 82),
        hex="#abd6c2",
    ),    "N1653": Color(
        name="N1653",
        hue_name="Mint",
        rgb=RGB(137, 194, 169),
        hcl=HCL(165, 24, 74),
        hex="#89c2a9",
    ),    "N1654": Color(
        name="N1654",
        hue_name="Mint",
        rgb=RGB(102, 175, 145),
        hcl=HCL(165, 30, 66),
        hex="#66af91",
    ),    "N1655": Color(
        name="N1655",
        hue_name="Mint",
        rgb=RGB(64, 155, 122),
        hcl=HCL(165, 36, 58),
        hex="#409b7a",
    ),    "N1656": Color(
        name="N1656",
        hue_name="Mint",
        rgb=RGB(60, 132, 105),
        hcl=HCL(165, 30, 50),
        hex="#3c8469",
    ),    "N1657": Color(
        name="N1657",
        hue_name="Mint",
        rgb=RGB(55, 109, 88),
        hcl=HCL(165, 24, 42),
        hex="#376d58",
    ),    "N1658": Color(
        name="N1658",
        hue_name="Mint",
        rgb=RGB(49, 88, 72),
        hcl=HCL(165, 18, 34),
        hex="#315848",
    ),    "N1659": Color(
        name="N1659",
        hue_name="Mint",
        rgb=RGB(43, 67, 56),
        hcl=HCL(165, 12, 26),
        hex="#2b4338",
    ),}

# Cyan
# -----------------------------------------------------------------------------
colors["Cyan"] = {    "N1801": Color(
        name="N1801",
        hue_name="Cyan",
        rgb=RGB(201, 233, 226),
        hcl=HCL(180, 12, 90),
        hex="#c9e9e2",
    ),    "N1802": Color(
        name="N1802",
        hue_name="Cyan",
        rgb=RGB(166, 214, 203),
        hcl=HCL(180, 18, 82),
        hex="#a6d6cb",
    ),    "N1803": Color(
        name="N1803",
        hue_name="Cyan",
        rgb=RGB(129, 195, 181),
        hcl=HCL(180, 24, 74),
        hex="#81c3b5",
    ),    "N1804": Color(
        name="N1804",
        hue_name="Cyan",
        rgb=RGB(91, 175, 159),
        hcl=HCL(180, 30, 66),
        hex="#5baf9f",
    ),    "N1805": Color(
        name="N1805",
        hue_name="Cyan",
        rgb=RGB(42, 156, 138),
        hcl=HCL(180, 36, 58),
        hex="#2a9c8a",
    ),    "N1806": Color(
        name="N1806",
        hue_name="Cyan",
        rgb=RGB(45, 133, 118),
        hcl=HCL(180, 30, 50),
        hex="#2d8576",
    ),    "N1807": Color(
        name="N1807",
        hue_name="Cyan",
        rgb=RGB(45, 110, 98),
        hcl=HCL(180, 24, 42),
        hex="#2d6e62",
    ),    "N1808": Color(
        name="N1808",
        hue_name="Cyan",
        rgb=RGB(43, 88, 79),
        hcl=HCL(180, 18, 34),
        hex="#2b584f",
    ),    "N1809": Color(
        name="N1809",
        hue_name="Cyan",
        rgb=RGB(40, 67, 61),
        hcl=HCL(180, 12, 26),
        hex="#28433d",
    ),}

# Teal
# -----------------------------------------------------------------------------
colors["Teal"] = {    "N1951": Color(
        name="N1951",
        hue_name="Teal",
        rgb=RGB(200, 233, 232),
        hcl=HCL(195, 12, 90),
        hex="#c8e9e8",
    ),    "N1952": Color(
        name="N1952",
        hue_name="Teal",
        rgb=RGB(163, 214, 212),
        hcl=HCL(195, 18, 82),
        hex="#a3d6d4",
    ),    "N1953": Color(
        name="N1953",
        hue_name="Teal",
        rgb=RGB(125, 195, 192),
        hcl=HCL(195, 24, 74),
        hex="#7dc3c0",
    ),    "N1954": Color(
        name="N1954",
        hue_name="Teal",
        rgb=RGB(83, 175, 173),
        hcl=HCL(195, 30, 66),
        hex="#53afad",
    ),    "N1955": Color(
        name="N1955",
        hue_name="Teal",
        rgb=RGB(16, 156, 154),
        hcl=HCL(195, 36, 58),
        hex="#109c9a",
    ),    "N1956": Color(
        name="N1956",
        hue_name="Teal",
        rgb=RGB(32, 133, 131),
        hcl=HCL(195, 30, 50),
        hex="#208583",
    ),    "N1957": Color(
        name="N1957",
        hue_name="Teal",
        rgb=RGB(38, 110, 109),
        hcl=HCL(195, 24, 42),
        hex="#266e6d",
    ),    "N1958": Color(
        name="N1958",
        hue_name="Teal",
        rgb=RGB(39, 88, 87),
        hcl=HCL(195, 18, 34),
        hex="#275857",
    ),    "N1959": Color(
        name="N1959",
        hue_name="Teal",
        rgb=RGB(38, 67, 66),
        hcl=HCL(195, 12, 26),
        hex="#264342",
    ),}

# Capri
# -----------------------------------------------------------------------------
colors["Capri"] = {    "N2101": Color(
        name="N2101",
        hue_name="Capri",
        rgb=RGB(200, 233, 237),
        hcl=HCL(210, 12, 90),
        hex="#c8e9ed",
    ),    "N2102": Color(
        name="N2102",
        hue_name="Capri",
        rgb=RGB(163, 213, 220),
        hcl=HCL(210, 18, 82),
        hex="#a3d5dc",
    ),    "N2103": Color(
        name="N2103",
        hue_name="Capri",
        rgb=RGB(125, 194, 203),
        hcl=HCL(210, 24, 74),
        hex="#7dc2cb",
    ),    "N2104": Color(
        name="N2104",
        hue_name="Capri",
        rgb=RGB(82, 174, 186),
        hcl=HCL(210, 30, 66),
        hex="#52aeba",
    ),    "N2105": Color(
        name="N2105",
        hue_name="Capri",
        rgb=RGB(1, 155, 170),
        hcl=HCL(210, 36, 58),
        hex="#019baa",
    ),    "N2106": Color(
        name="N2106",
        hue_name="Capri",
        rgb=RGB(28, 132, 144),
        hcl=HCL(210, 30, 50),
        hex="#1c8490",
    ),    "N2107": Color(
        name="N2107",
        hue_name="Capri",
        rgb=RGB(36, 109, 118),
        hcl=HCL(210, 24, 42),
        hex="#246d76",
    ),    "N2108": Color(
        name="N2108",
        hue_name="Capri",
        rgb=RGB(39, 87, 94),
        hcl=HCL(210, 18, 34),
        hex="#27575e",
    ),    "N2109": Color(
        name="N2109",
        hue_name="Capri",
        rgb=RGB(38, 66, 70),
        hcl=HCL(210, 12, 26),
        hex="#264246",
    ),}

# Sky
# -----------------------------------------------------------------------------
colors["Sky"] = {    "N2251": Color(
        name="N2251",
        hue_name="Sky",
        rgb=RGB(202, 232, 242),
        hcl=HCL(225, 12, 90),
        hex="#cae8f2",
    ),    "N2252": Color(
        name="N2252",
        hue_name="Sky",
        rgb=RGB(166, 212, 227),
        hcl=HCL(225, 18, 82),
        hex="#a6d4e3",
    ),    "N2253": Color(
        name="N2253",
        hue_name="Sky",
        rgb=RGB(129, 192, 212),
        hcl=HCL(225, 24, 74),
        hex="#81c0d4",
    ),    "N2254": Color(
        name="N2254",
        hue_name="Sky",
        rgb=RGB(88, 172, 198),
        hcl=HCL(225, 30, 66),
        hex="#58acc6",
    ),    "N2255": Color(
        name="N2255",
        hue_name="Sky",
        rgb=RGB(26, 153, 183),
        hcl=HCL(225, 36, 58),
        hex="#1a99b7",
    ),    "N2256": Color(
        name="N2256",
        hue_name="Sky",
        rgb=RGB(37, 130, 154),
        hcl=HCL(225, 30, 50),
        hex="#25829a",
    ),    "N2257": Color(
        name="N2257",
        hue_name="Sky",
        rgb=RGB(42, 108, 126),
        hcl=HCL(225, 24, 42),
        hex="#2a6c7e",
    ),    "N2258": Color(
        name="N2258",
        hue_name="Sky",
        rgb=RGB(42, 86, 100),
        hcl=HCL(225, 18, 34),
        hex="#2a5664",
    ),    "N2259": Color(
        name="N2259",
        hue_name="Sky",
        rgb=RGB(39, 66, 74),
        hcl=HCL(225, 12, 26),
        hex="#27424a",
    ),}

# Blue
# -----------------------------------------------------------------------------
colors["Blue"] = {    "N2401": Color(
        name="N2401",
        hue_name="Blue",
        rgb=RGB(206, 230, 246),
        hcl=HCL(240, 12, 90),
        hex="#cee6f6",
    ),    "N2402": Color(
        name="N2402",
        hue_name="Blue",
        rgb=RGB(172, 210, 233),
        hcl=HCL(240, 18, 82),
        hex="#acd2e9",
    ),    "N2403": Color(
        name="N2403",
        hue_name="Blue",
        rgb=RGB(138, 190, 220),
        hcl=HCL(240, 24, 74),
        hex="#8abedc",
    ),    "N2404": Color(
        name="N2404",
        hue_name="Blue",
        rgb=RGB(101, 170, 206),
        hcl=HCL(240, 30, 66),
        hex="#65aace",
    ),    "N2405": Color(
        name="N2405",
        hue_name="Blue",
        rgb=RGB(54, 150, 193),
        hcl=HCL(240, 36, 58),
        hex="#3696c1",
    ),    "N2406": Color(
        name="N2406",
        hue_name="Blue",
        rgb=RGB(54, 128, 163),
        hcl=HCL(240, 30, 50),
        hex="#3680a3",
    ),    "N2407": Color(
        name="N2407",
        hue_name="Blue",
        rgb=RGB(52, 106, 133),
        hcl=HCL(240, 24, 42),
        hex="#346a85",
    ),    "N2408": Color(
        name="N2408",
        hue_name="Blue",
        rgb=RGB(48, 85, 104),
        hcl=HCL(240, 18, 34),
        hex="#305568",
    ),    "N2409": Color(
        name="N2409",
        hue_name="Blue",
        rgb=RGB(43, 65, 77),
        hcl=HCL(240, 12, 26),
        hex="#2b414d",
    ),}

# Azure
# -----------------------------------------------------------------------------
colors["Azure"] = {    "N2551": Color(
        name="N2551",
        hue_name="Azure",
        rgb=RGB(211, 229, 248),
        hcl=HCL(255, 12, 90),
        hex="#d3e5f8",
    ),    "N2552": Color(
        name="N2552",
        hue_name="Azure",
        rgb=RGB(181, 207, 236),
        hcl=HCL(255, 18, 82),
        hex="#b5cfec",
    ),    "N2553": Color(
        name="N2553",
        hue_name="Azure",
        rgb=RGB(149, 187, 224),
        hcl=HCL(255, 24, 74),
        hex="#95bbe0",
    ),    "N2554": Color(
        name="N2554",
        hue_name="Azure",
        rgb=RGB(117, 166, 212),
        hcl=HCL(255, 30, 66),
        hex="#75a6d4",
    ),    "N2555": Color(
        name="N2555",
        hue_name="Azure",
        rgb=RGB(81, 146, 200),
        hcl=HCL(255, 36, 58),
        hex="#5192c8",
    ),    "N2556": Color(
        name="N2556",
        hue_name="Azure",
        rgb=RGB(73, 124, 168),
        hcl=HCL(255, 30, 50),
        hex="#497ca8",
    ),    "N2557": Color(
        name="N2557",
        hue_name="Azure",
        rgb=RGB(65, 103, 137),
        hcl=HCL(255, 24, 42),
        hex="#416789",
    ),    "N2558": Color(
        name="N2558",
        hue_name="Azure",
        rgb=RGB(57, 83, 107),
        hcl=HCL(255, 18, 34),
        hex="#39536b",
    ),    "N2559": Color(
        name="N2559",
        hue_name="Azure",
        rgb=RGB(48, 63, 79),
        hcl=HCL(255, 12, 26),
        hex="#303f4f",
    ),}

# Indigo
# -----------------------------------------------------------------------------
colors["Indigo"] = {    "N2701": Color(
        name="N2701",
        hue_name="Indigo",
        rgb=RGB(218, 227, 249),
        hcl=HCL(270, 12, 90),
        hex="#dae3f9",
    ),    "N2702": Color(
        name="N2702",
        hue_name="Indigo",
        rgb=RGB(190, 205, 238),
        hcl=HCL(270, 18, 82),
        hex="#becdee",
    ),    "N2703": Color(
        name="N2703",
        hue_name="Indigo",
        rgb=RGB(163, 183, 226),
        hcl=HCL(270, 24, 74),
        hex="#a3b7e2",
    ),    "N2704": Color(
        name="N2704",
        hue_name="Indigo",
        rgb=RGB(135, 162, 214),
        hcl=HCL(270, 30, 66),
        hex="#87a2d6",
    ),    "N2705": Color(
        name="N2705",
        hue_name="Indigo",
        rgb=RGB(106, 141, 202),
        hcl=HCL(270, 36, 58),
        hex="#6a8dca",
    ),    "N2706": Color(
        name="N2706",
        hue_name="Indigo",
        rgb=RGB(93, 120, 170),
        hcl=HCL(270, 30, 50),
        hex="#5d78aa",
    ),    "N2707": Color(
        name="N2707",
        hue_name="Indigo",
        rgb=RGB(79, 100, 139),
        hcl=HCL(270, 24, 42),
        hex="#4f648b",
    ),    "N2708": Color(
        name="N2708",
        hue_name="Indigo",
        rgb=RGB(66, 81, 108),
        hcl=HCL(270, 18, 34),
        hex="#42516c",
    ),    "N2709": Color(
        name="N2709",
        hue_name="Indigo",
        rgb=RGB(53, 62, 80),
        hcl=HCL(270, 12, 26),
        hex="#353e50",
    ),}

# Violet
# -----------------------------------------------------------------------------
colors["Violet"] = {    "N2851": Color(
        name="N2851",
        hue_name="Violet",
        rgb=RGB(224, 225, 249),
        hcl=HCL(285, 12, 90),
        hex="#e0e1f9",
    ),    "N2852": Color(
        name="N2852",
        hue_name="Violet",
        rgb=RGB(200, 202, 237),
        hcl=HCL(285, 18, 82),
        hex="#c8caed",
    ),    "N2853": Color(
        name="N2853",
        hue_name="Violet",
        rgb=RGB(177, 179, 225),
        hcl=HCL(285, 24, 74),
        hex="#b1b3e1",
    ),    "N2854": Color(
        name="N2854",
        hue_name="Violet",
        rgb=RGB(153, 157, 213),
        hcl=HCL(285, 30, 66),
        hex="#999dd5",
    ),    "N2855": Color(
        name="N2855",
        hue_name="Violet",
        rgb=RGB(129, 136, 200),
        hcl=HCL(285, 36, 58),
        hex="#8188c8",
    ),    "N2856": Color(
        name="N2856",
        hue_name="Violet",
        rgb=RGB(111, 116, 168),
        hcl=HCL(285, 30, 50),
        hex="#6f74a8",
    ),    "N2857": Color(
        name="N2857",
        hue_name="Violet",
        rgb=RGB(93, 97, 137),
        hcl=HCL(285, 24, 42),
        hex="#5d6189",
    ),    "N2858": Color(
        name="N2858",
        hue_name="Violet",
        rgb=RGB(76, 78, 108),
        hcl=HCL(285, 18, 34),
        hex="#4c4e6c",
    ),    "N2859": Color(
        name="N2859",
        hue_name="Violet",
        rgb=RGB(59, 60, 79),
        hcl=HCL(285, 12, 26),
        hex="#3b3c4f",
    ),}

# Magenta
# -----------------------------------------------------------------------------
colors["Magenta"] = {    "N3001": Color(
        name="N3001",
        hue_name="Magenta",
        rgb=RGB(231, 223, 246),
        hcl=HCL(300, 12, 90),
        hex="#e7dff6",
    ),    "N3002": Color(
        name="N3002",
        hue_name="Magenta",
        rgb=RGB(211, 199, 233),
        hcl=HCL(300, 18, 82),
        hex="#d3c7e9",
    ),    "N3003": Color(
        name="N3003",
        hue_name="Magenta",
        rgb=RGB(190, 175, 220),
        hcl=HCL(300, 24, 74),
        hex="#beafdc",
    ),    "N3004": Color(
        name="N3004",
        hue_name="Magenta",
        rgb=RGB(170, 152, 207),
        hcl=HCL(300, 30, 66),
        hex="#aa98cf",
    ),    "N3005": Color(
        name="N3005",
        hue_name="Magenta",
        rgb=RGB(149, 130, 194),
        hcl=HCL(300, 36, 58),
        hex="#9582c2",
    ),    "N3006": Color(
        name="N3006",
        hue_name="Magenta",
        rgb=RGB(127, 111, 163),
        hcl=HCL(300, 30, 50),
        hex="#7f6fa3",
    ),    "N3007": Color(
        name="N3007",
        hue_name="Magenta",
        rgb=RGB(106, 93, 134),
        hcl=HCL(300, 24, 42),
        hex="#6a5d86",
    ),    "N3008": Color(
        name="N3008",
        hue_name="Magenta",
        rgb=RGB(85, 76, 105),
        hcl=HCL(300, 18, 34),
        hex="#554c69",
    ),    "N3009": Color(
        name="N3009",
        hue_name="Magenta",
        rgb=RGB(65, 59, 77),
        hcl=HCL(300, 12, 26),
        hex="#413b4d",
    ),}

# Purple
# -----------------------------------------------------------------------------
colors["Purple"] = {    "N3151": Color(
        name="N3151",
        hue_name="Purple",
        rgb=RGB(237, 221, 243),
        hcl=HCL(315, 12, 90),
        hex="#edddf3",
    ),    "N3152": Color(
        name="N3152",
        hue_name="Purple",
        rgb=RGB(220, 196, 228),
        hcl=HCL(315, 18, 82),
        hex="#dcc4e4",
    ),    "N3153": Color(
        name="N3153",
        hue_name="Purple",
        rgb=RGB(202, 172, 214),
        hcl=HCL(315, 24, 74),
        hex="#caacd6",
    ),    "N3154": Color(
        name="N3154",
        hue_name="Purple",
        rgb=RGB(185, 148, 199),
        hcl=HCL(315, 30, 66),
        hex="#b994c7",
    ),    "N3155": Color(
        name="N3155",
        hue_name="Purple",
        rgb=RGB(167, 124, 185),
        hcl=HCL(315, 36, 58),
        hex="#a77cb9",
    ),    "N3156": Color(
        name="N3156",
        hue_name="Purple",
        rgb=RGB(141, 107, 156),
        hcl=HCL(315, 30, 50),
        hex="#8d6b9c",
    ),    "N3157": Color(
        name="N3157",
        hue_name="Purple",
        rgb=RGB(117, 90, 127),
        hcl=HCL(315, 24, 42),
        hex="#755a7f",
    ),    "N3158": Color(
        name="N3158",
        hue_name="Purple",
        rgb=RGB(93, 73, 100),
        hcl=HCL(315, 18, 34),
        hex="#5d4964",
    ),    "N3159": Color(
        name="N3159",
        hue_name="Purple",
        rgb=RGB(70, 57, 75),
        hcl=HCL(315, 12, 26),
        hex="#46394b",
    ),}

# Rose
# -----------------------------------------------------------------------------
colors["Rose"] = {    "N3301": Color(
        name="N3301",
        hue_name="Rose",
        rgb=RGB(243, 220, 238),
        hcl=HCL(330, 12, 90),
        hex="#f3dcee",
    ),    "N3302": Color(
        name="N3302",
        hue_name="Rose",
        rgb=RGB(227, 194, 221),
        hcl=HCL(330, 18, 82),
        hex="#e3c2dd",
    ),    "N3303": Color(
        name="N3303",
        hue_name="Rose",
        rgb=RGB(212, 169, 205),
        hcl=HCL(330, 24, 74),
        hex="#d4a9cd",
    ),    "N3304": Color(
        name="N3304",
        hue_name="Rose",
        rgb=RGB(197, 144, 188),
        hcl=HCL(330, 30, 66),
        hex="#c590bc",
    ),    "N3305": Color(
        name="N3305",
        hue_name="Rose",
        rgb=RGB(181, 119, 172),
        hcl=HCL(330, 36, 58),
        hex="#b577ac",
    ),    "N3306": Color(
        name="N3306",
        hue_name="Rose",
        rgb=RGB(153, 103, 145),
        hcl=HCL(330, 30, 50),
        hex="#996791",
    ),    "N3307": Color(
        name="N3307",
        hue_name="Rose",
        rgb=RGB(125, 87, 119),
        hcl=HCL(330, 24, 42),
        hex="#7d5777",
    ),    "N3308": Color(
        name="N3308",
        hue_name="Rose",
        rgb=RGB(99, 71, 95),
        hcl=HCL(330, 18, 34),
        hex="#63475f",
    ),    "N3309": Color(
        name="N3309",
        hue_name="Rose",
        rgb=RGB(74, 56, 71),
        hcl=HCL(330, 12, 26),
        hex="#4a3847",
    ),}

# Pink
# -----------------------------------------------------------------------------
colors["Pink"] = {    "N3451": Color(
        name="N3451",
        hue_name="Pink",
        rgb=RGB(247, 219, 233),
        hcl=HCL(345, 12, 90),
        hex="#f7dbe9",
    ),    "N3452": Color(
        name="N3452",
        hue_name="Pink",
        rgb=RGB(233, 193, 213),
        hcl=HCL(345, 18, 82),
        hex="#e9c1d5",
    ),    "N3453": Color(
        name="N3453",
        hue_name="Pink",
        rgb=RGB(219, 167, 194),
        hcl=HCL(345, 24, 74),
        hex="#dba7c2",
    ),    "N3454": Color(
        name="N3454",
        hue_name="Pink",
        rgb=RGB(205, 141, 175),
        hcl=HCL(345, 30, 66),
        hex="#cd8daf",
    ),    "N3455": Color(
        name="N3455",
        hue_name="Pink",
        rgb=RGB(191, 115, 157),
        hcl=HCL(345, 36, 58),
        hex="#bf739d",
    ),    "N3456": Color(
        name="N3456",
        hue_name="Pink",
        rgb=RGB(161, 100, 133),
        hcl=HCL(345, 30, 50),
        hex="#a16485",
    ),    "N3457": Color(
        name="N3457",
        hue_name="Pink",
        rgb=RGB(132, 84, 110),
        hcl=HCL(345, 24, 42),
        hex="#84546e",
    ),    "N3458": Color(
        name="N3458",
        hue_name="Pink",
        rgb=RGB(104, 70, 88),
        hcl=HCL(345, 18, 34),
        hex="#684658",
    ),    "N3459": Color(
        name="N3459",
        hue_name="Pink",
        rgb=RGB(77, 55, 67),
        hcl=HCL(345, 12, 26),
        hex="#4d3743",
    ),}

# Red
# -----------------------------------------------------------------------------
colors["Red"] = {    "N3601": Color(
        name="N3601",
        hue_name="Red",
        rgb=RGB(249, 219, 227),
        hcl=HCL(360, 12, 90),
        hex="#f9dbe3",
    ),    "N3602": Color(
        name="N3602",
        hue_name="Red",
        rgb=RGB(237, 192, 205),
        hcl=HCL(360, 18, 82),
        hex="#edc0cd",
    ),    "N3603": Color(
        name="N3603",
        hue_name="Red",
        rgb=RGB(224, 166, 183),
        hcl=HCL(360, 24, 74),
        hex="#e0a6b7",
    ),    "N3604": Color(
        name="N3604",
        hue_name="Red",
        rgb=RGB(211, 140, 162),
        hcl=HCL(360, 30, 66),
        hex="#d38ca2",
    ),    "N3605": Color(
        name="N3605",
        hue_name="Red",
        rgb=RGB(197, 114, 141),
        hcl=HCL(360, 36, 58),
        hex="#c5728d",
    ),    "N3606": Color(
        name="N3606",
        hue_name="Red",
        rgb=RGB(166, 98, 120),
        hcl=HCL(360, 30, 50),
        hex="#a66278",
    ),    "N3607": Color(
        name="N3607",
        hue_name="Red",
        rgb=RGB(136, 84, 100),
        hcl=HCL(360, 24, 42),
        hex="#885464",
    ),    "N3608": Color(
        name="N3608",
        hue_name="Red",
        rgb=RGB(107, 69, 81),
        hcl=HCL(360, 18, 34),
        hex="#6b4551",
    ),    "N3609": Color(
        name="N3609",
        hue_name="Red",
        rgb=RGB(79, 55, 62),
        hcl=HCL(360, 12, 26),
        hex="#4f373e",
    ),}


# =============================================================================
# Convenience Access
# =============================================================================

# Flat dictionary for direct access by color name
colors_flat: Dict[str, Color] = {}
for hue_group in colors.values():
    colors_flat.update(hue_group)


# =============================================================================
# HueGL Class
# =============================================================================

class HueGL:
    """
    Main class for working with the hue.gl color palette.

    Provides convenient access to colors by hue name and shade index.

    Example:
        >>> palette = HueGL()
        >>> blue5 = palette.get_color('Blue', 5)
        >>> print(blue5.hex)
        '#4169E1'
    """

    def __init__(self) -> None:
        self._colors = colors
        self._flat = colors_flat

    @property
    def hue_names(self) -> list[str]:
        """Returns list of all hue names."""
        return list(self._colors.keys())

    @property
    def shade_count(self) -> int:
        """Returns number of shades per hue (default: 9)."""
        return 9

    def get_color(self, hue_name: str, shade: int) -> Optional[Color]:
        """
        Get a color by hue name and shade index (1-9).

        Args:
            hue_name: The hue group name (e.g., 'Blue', 'Red', 'Grey')
            shade: The shade index from 1 (lightest) to 9 (darkest)

        Returns:
            Color object or None if not found
        """
        if hue_name not in self._colors:
            return None

        # Find the color with the matching shade
        hue_group = self._colors[hue_name]
        for color in hue_group.values():
            if color.name.endswith(str(shade)):
                return color
        return None

    def get_hue_group(self, hue_name: str) -> Optional[Dict[str, Color]]:
        """
        Get all colors in a hue group.

        Args:
            hue_name: The hue group name (e.g., 'Blue', 'Red')

        Returns:
            Dictionary of colors in the hue group or None
        """
        return self._colors.get(hue_name)

    def get_by_name(self, color_name: str) -> Optional[Color]:
        """
        Get a color by its full name (e.g., 'N2405').

        Args:
            color_name: The full color name

        Returns:
            Color object or None if not found
        """
        return self._flat.get(color_name)

    def __getitem__(self, key: str) -> Dict[str, Color]:
        """Allow dictionary-style access to hue groups."""
        return self._colors[key]

    def __contains__(self, key: str) -> bool:
        """Check if a hue name exists."""
        return key in self._colors

    def __iter__(self):
        """Iterate over hue names."""
        return iter(self._colors)

    def __len__(self) -> int:
        """Return total number of colors."""
        return len(self._flat)


# =============================================================================
# Module-level instance for convenience
# =============================================================================

hue = HueGL()
