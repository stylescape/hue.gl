//DESCRIPTION:Create ASE file from array
// A Jongware Script 01-Dec-2019

source = [
	'darkkhaki',189,183,107,
	'darkmagenta',139,0,139,
	'darkolivegreen',85,107,47,
	'darkorange',255,140,0,
	'darkorchid',153,50,204,
	'darkred',139,0,0,
	'darksalmon',233,150,122,
	'darkseagreen',143,188,143
];

File.prototype.writeLong = function (value)
{
	var buf = String.fromCharCode((value>>24) & 0xff)+String.fromCharCode((value>>16) & 0xff)+String.fromCharCode((value>>8) & 0xff)+String.fromCharCode((value>>0) & 0xff);
	this.write (buf);
}

File.prototype.writeShort = function (value)
{
	var buf = String.fromCharCode((value>>8) & 0xff)+String.fromCharCode((value>>0) & 0xff);
	this.write (buf);
}

/* warning: not tested for invalid numbers such as
   too small, too large, or +/-Inf */
/* (so you have been warned) */
File.prototype.writeFloat = function (value)
{
	var sign,value,exponent,mantissa_pre,mantissa,i;
	if (value == 0)
	{
		this.writeLong(0);
		return;
	}
	sign = value < 0 ? 0x80000000 : 0;
	value = Math.abs(value);
	exponent = 127;
	if (value <= 1)
	{
		while (value < 1)
		{
			exponent--;
			value *= 2;
		}
	} else
	{
		/* tested 'caus I need it! */
		while (value >= 2)
		{
			exponent++;
			value /= 2;
		}
	}
	mantissa_pre = value-Math.floor(value);
	/* rough conversion to binary */
	mantissa = 0;
	for (i=0; i<22; i++)
	{
		mantissa_pre *= 2;
		mantissa <<= 1;
		mantissa += (mantissa_pre>>0);
		mantissa_pre -= (mantissa_pre>>0);
	}
	/* final bit */
	mantissa <<= 1;
	mantissa_pre = Math.round(2*mantissa_pre);
	mantissa += (mantissa_pre>>0);
	/* concatenate all */
	result = sign + (exponent<<23)+mantissa;
	this.writeLong (result);
}

aseFile = File(Folder.myDocuments+'/mylist.ase')
if (aseFile.open('w') == false)
{
	alert ('okay, we cannot write that file');
	exit();
}
aseFile.encoding = "binary";

/* Signature */
aseFile.write ('ASEF');
aseFile.writeLong(0x10000);

/* Number of colors */
aseFile.writeLong(source.length/4);

/* The colors themselves */
for (i=0; i<source.length/4; i++)
{
	/* Block type: color */
	aseFile.writeShort(1);
	/* Block length: nameLength + 2*name + '0,0' + 'mode' + 3*value + 'type' */
	aseFile.writeLong (2+2*source[4*i].length+2+4+3*4+2);
	/* Name, in unicode (presumably!) */
	aseFile.writeShort (source[4*i].length+1);
	for (j=0; j<source[4*i].length; j++)
	{
		aseFile.writeShort(source[4*i].charCodeAt(j));
	}
	/* .. terminating 0 .. */
	aseFile.writeShort(0);
	/* Mode: RGB */
	aseFile.write ('RGB ');
	/* Values */
	r = source[4*i+1]/255;
	g = source[4*i+2]/255;
	b = source[4*i+3]/255;
	aseFile.writeFloat(r);
	aseFile.writeFloat(g);
	aseFile.writeFloat(b);
	/* type: normal */
	aseFile.writeShort(0);
}
aseFile.close();