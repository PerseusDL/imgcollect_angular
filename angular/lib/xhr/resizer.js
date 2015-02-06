/*

############### FIRST SKETCH

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


############ SECOND DRAFT

var imgup = tserv('imgup');
var json = tserv('json');
var urnServ = tserv('urnServ');
var onto = tserv('onto');
var user = tserv('user');

# This is all I'll start with...

var upload_urn = 'urn:cite:perseus:upload.K6BGkIMwMoR';
var max_width = 200;
var max_height = 200;

# Get the upload src

var upload_src = null;
json.urn( upload_urn ).then( 
function( data ){
	upload_src = data['src'][0];
});

# Get the upload json file

var upload_json = null;
json.get( upload_src ).then(
function( data ){
	upload_json = data;
});

# Get a fresh resize_urn

var resize_urn = null;
urnServ.fresh( urnServ.base+"resize.{{ id }}", function( urn ){
	resize_urn = urn;
});

# Get the resize json template

var tmpl = null;
json.get( 'default/resize.json' ).then( function( data ){
	tmpl = data;
});

# Fill in the blanks

tmpl['@id'] = resize_urn;
tmpl[onto.with_prefix('memberOf')]['@id'] = upload_json['@id'];

# Send it off

var conf = tserv('config');
var save_to = conf.xhr.json.url+'/data/resize/'+resize_urn;
var img = upload_json[ onto.with_prefix('src') ]['@id'];
imgup.resize( img, 200, 200, save_to, tmpl ).then( function( data ){
	console.log( data );
});



*/