// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();
$(document).ready( function(){
	
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
	
	function toggle(me) {
		$(me).addClass('selected');
	}
	
	function view() { return window.location.hash.split('/')[1] }
	
	$(window).bind('hashchange', function() {
		clear();
		check();
	})

	check();
	
})