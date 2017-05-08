	/*$(function() {


	$.scrollify({
		section:".panel",
		//sectionName:false,
		scrollSpeed:1100,
		after:function(i) {
*/

/*
			if(i===2) {
				$.scrollify.setOptions({
					easing:"easeOutExpo"
				});
			}*/
/*
		}
	});

	$(".scroll,.scroll-btn").click(function(e) {
		e.preventDefault();

		$.scrollify.next();



	});

});*/
$(()=> {
  $.scrollify({
		section:".panel",
    sectionName:false,
    scrollSpeed:1500,
    interstitialSection:".header,.footer"
  });
});

