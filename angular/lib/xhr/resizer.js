/*

Resize workspace

# Get the services

var imgup = tserv('imgup');
var json = tserv('json');
var urn = tserv('urnServ');
var onto = tserv('onto');
var resize_urn = 'urn:cite:perseus:resize.ry897TREW'
var upload_urn = 'urn:cite:perseus:upload.7ISACSKTGEY';
var src = 'http://localhost:1234/upload/2015/FEB/manuscript.jpg';
var jackson = 'http://localhost:4567/data/resize/urn:cite:perseus:resize.ry897TREW';
var tmpl = null;
json.get('default/resize.json').then( 
function( data ){
	tmpl = data;
});

# Fill out the template

tmpl['@id'] = resize_urn;
tmpl['cite:belongsTo']['@id'] = upload_urn;

# Resize

imgup.resize( src, 200, 200, jackson, tmpl ).then( function( data ){
	console.log( data );
});

*/