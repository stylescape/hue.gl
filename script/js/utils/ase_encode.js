"use strict";
var ByteBuffer = require('bytebuffer');
var constants = require('./constants');
function encode(data) {
    var colors = data.colors, numberOfSwatches = data.colors.length, ase = new ByteBuffer();
    ase.writeUTF8String(constants.FILE_SIGNATURE);
    ase.writeInt(constants.FORMAT_VERSION);
    ase.writeInt(numberOfSwatches);
    for (var i = 0; i < numberOfSwatches; i++) {
        var color = colors[i], swatch = new ByteBuffer(), j = null;
        ase.writeShort(constants.COLOR_START);
        swatch.writeShort(color.name.length + 1);
        for (j = 0; j < color.name.length; j++) {
            swatch.writeShort(color.name.charCodeAt(j));
        }
        swatch.writeShort(0);
        var model = color.model.length == 4 ? color.model : color.model + " ";
        swatch.writeUTF8String(model);
        for (j = 0; j < constants.COLOR_SIZES[color.model.toUpperCase()]; j++) {
            swatch.writeFloat(color.color[j]);
        }
        swatch.writeShort(constants.WRITE_COLOR_TYPES[color.type]);
        ase.writeInt(swatch.offset);
        swatch.flip();
        ase.append(swatch);
    }
    ase.flip();
    return ase.toBuffer();
}
module.exports = encode;
//# sourceMappingURL=ase_encode.js.map