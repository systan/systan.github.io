$(document).on("click", ".popupImage:not([data-popup-image])", function(event){
	return false;
});
function bindPopupImage(option){
	var defaultOption = {
		showLoupe:true,
		showTitle:false,
		className:'popupImage',
		isVisible:true
	};
	option = $.extend(defaultOption, option);
	$('.' + option.className).not('[data-popup-image]').each(function(){
		$this = $(this);
		if(option.isVisible && !$this.is(':visible')){
			return true;
		}
		if(option.showLoupe){
			$this.append('<span class="loupe"></span>');
		}
		$this.attr('data-popup-image', 'true');
		var title = false;
		if(option.showTitle){
			title = $this.find('img').attr('alt');
		}
		
		var options = {rel:option.className, title:title };
		
		if( option['maxWidth']!=null && option['maxWidth']!=undefined ){
			options['maxWidth'] = option['maxWidth'];
		}
		if( option['maxHeight']!=null && option['maxHeight']!=undefined ){
			options['maxHeight'] = option['maxHeight'];
		}
		
		$this.colorbox(options);
	});
}