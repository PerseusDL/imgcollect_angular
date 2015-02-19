appDirectives.directive('slider',
function( $timeout ){
	return {
		restrict: 'A',
		link: function( scope, elem, attr ){
			var max = 100;
			elem.slider({
				range: "min",
				value: attr.start * max,
				min: 0,
				max: max,
				slide: function( e, ui ){
					scope[attr.change]( ui.value / max );
				}
			});
		}
	}
});