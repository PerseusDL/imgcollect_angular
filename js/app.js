// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();
$(document).ready( function(){
	$('.button-group .button').on('touchstart click', function() {
		toggle(this);
	});
	var view = window.location.hash.split('/')[1];
	$('.button-group .button').each( function() {
		var check = $(this).attr('href').split('/')[1];
		if ( check == view ) {
			toggle(this)
		}
	})
	function toggle(me) {
		$('.button-group .button').removeClass('selected');
		$(me).addClass('selected');
	}
})