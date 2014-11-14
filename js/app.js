// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();
$(document).ready( function(){
	$('.button-group .button').on('touchstart click', function() {
		$('.button-group .button').removeClass('selected');
		$(this).addClass('selected');
	});
})