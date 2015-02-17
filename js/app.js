// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var sel = '.button-group .button';

function check() {
	$( sel ).each( function() {
		var check = $(this).attr('href').split('/')[1];
		if ( check == view() ) {
			toggle(this)
		}
	});
}

function clear() { $( sel ).removeClass('selected') }

function toggle( me ) {
	$(me).addClass('selected');
}

function view() { return window.location.hash.split('/')[1] }

$(document).ready( function(){
	$(window).bind('hashchange', function() {
		clear();
		check();
	})
})


// Easy way to get a service handle...

function tserv( service ){
	return angular.element( document.body ).injector().get( service )
}