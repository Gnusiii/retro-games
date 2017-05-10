

$(document).ready(() =>{
	$(()=> {
  		$.scrollify({
		section:".panel",
		sectionName: "section-name",    
    	scrollSpeed:1500,
    	interstitialSection:".header,.footer"
  		});
	});

	$('.link').click(function() {
		const index = parseInt(this.getAttribute("data-index"))
		$.scrollify.move(index);		
	})
});


