function loadAccessRanking ($container){

	$container.on('click', '.rankingButton a', function(){
		$this = $(this);
		
		var xml = $this.closest('li').attr('data-ranking') + ".xml";
		$target = $container.find('.rankingList');
		
		$target.html('<li>' + ats.getNowloading() + '</li>');
		
		$container.find('.link-text').replaceWith(function(){
			return '<a href="#">' + $(this).text() + "</a>";
		});
		
		$this.replaceWith(function(){
			return '<span class="link-text" style="margin:0">' +  $this.text() + "</span>";
		});
		
		ats.loadRanking({
			url:xml,
			targetElement:$target
		});
		
		return false;
	});
	
	$container.find('.rankingButton a:first').trigger('click');
	
}
