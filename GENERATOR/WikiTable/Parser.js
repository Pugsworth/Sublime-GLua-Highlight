/*
	Parses Wiki-Tables of structures, from both gmodwiki.net and wiki.garrysmod.com, into snippet format
	This is meant to be used for when functions accept a table structure.

	sample output, taken from the Color structure:
	<snippet>
		<content><![CDATA[
	{
		r = ${1:-- number, The red channel},
		g = ${2:-- number, The green channel},
		b = ${3:-- number, The blue channel},
		a = ${4:-- number, The alpha channel},
	}]]></content>
		<tabTrigger>Color</tabTrigger>
		<description>Color</description>
		<scope>source.lua</scope>
	</snippet>
*/

var table = document.querySelector('table.wikitable > tbody');
var table_children = table.children;

var imaxnamelength = 0;
var sstructurename = document.location.pathname.match(/[^\/]+$/gi)[0];

var output_array = [];
var data = [];
for (var i = 0; i < table_children.length; i++) { // Parse the data and obtaining the max name length for assignment alignment. Is there a better system than looping twice?
	var row = table_children[i];
	var row_children = row.children;

	if (row.nodeName != 'TR') {continue;}

	var stype = row_children[0].children[0].textContent.trim().replace('\n', '');
	var sname = row_children[1].textContent.trim().replace('\n', '');
	var sdesc = row_children[2].textContent.trim().replace('\n', '');

	(imaxnamelength < sname.length) && (imaxnamelength = sname.length);

	data.push([stype, sname, sdesc]);
};

for (var i = 0; i < data.length; i++) { // Go back over parsed data and use the max name lengh to create an aligned output
	var d = data[i];

	var stype = d[0];
	var sname = d[1];
	var sdesc = d[2];

	var output = ['\t', sname, Array((imaxnamelength - sname.length)+1).join(' ') + ' = ', '${', i+1, ':-- ', stype, ', ', sdesc, '},'].join('');
	// console.log(output);
	output_array.push(output);
};

var snippet_template = ['<snippet>\n',
'\t<content><![CDATA[\n', '{\n', output_array.join('\n'), '\n}', ']]></content>\n',
'\t<tabTrigger>', sstructurename, '</tabTrigger>\n',
'\t<description>', sstructurename, '</description>\n',
'\t<scope>source.lua</scope>\n',
'</snippet>'];
console.log(snippet_template.join(''));
