// 特集エリア用ファイルインクルード
function writeFeatured(){
	$.ajax({
		url: "/ats-static/include/news/detail_featured.html",
		success: function(html){
			$('.divFeatured').append(html);
		}
	});
}
