app.service( 'cropper', [
'json',
'imgup',
'config',
'urnServ',
'onto',
'item',
'tmpl',
function( json, imgup, config, urnServ, onto, item, tmpl ) {
  
  var roi_urn = null;
  var img = null;
  var item_urn = null;
  var crop_urn = null;
  var crop_tmpl = null;
  var urn = null;
  var param = [];
  
  return {
    add: add
  }
  
  
  // _urn @string ROI URN 
  // ex. 'urn:cite:perseus:manuscript.ROF3ZnNQT8q@0.7112,0.4808,0.1922,0.0774'
  
  function add( urn ){
    
    // Break-up ROI URN
    
    roi_urn = urn;
    var s = urn.split('@');
    item_urn = s[0];
    param = s[1].split(',');
    
    // Get the upload path associated with item_urn
    
    return item.upload_src( item_urn ).then(
    function( r ){
      img = r[0]['img'];
      return get_urn();
    });
  }
  
  function get_urn(){
    return urnServ.fresh( urnServ.base+"crop.{{ id }}",
    function( urn ){
      crop_urn = urn;
      return get_tmpl();
    });
  }
  
  function get_tmpl(){
    return tmpl.get( 'crop' ).then(
    function( r ){
      crop_tmpl = r;
      return set_vals();
    })
  }
  
  function set_vals(){
    crop_tmpl['@id'] = crop_urn;
    crop_tmpl[ onto.with_prefix('represents') ] = { '@id': roi_urn };
    send();
  }
  
  
  // Send the crop job to imgup
  
  function send(){
    var save_to = config.xhr.json.url+'/data/crop/'+crop_urn;
    return imgup.crop( img, param[0], param[1], param[2], param[3], save_to, crop_tmpl ).then(
    function( r ){
      return r;
    });
  }
  
}]);

/*

To run this in the console...

var crop = tserv('cropper');
crop.add( 'urn:cite:perseus:manuscript.ROF3ZnNQT8q@0.7112,0.4808,0.1922,0.0774' ).then(
function( r ){
  console.log( r );
});

*/