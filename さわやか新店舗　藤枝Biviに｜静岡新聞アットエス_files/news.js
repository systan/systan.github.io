function newsSetSecondNavi(category_name){
	category_name = category_name.replace(/・/g, "");
	if(category_name == "気象地震災害"){
		category_name = "天気地震";
	}else if(category_name == "地域情報"){
		category_name = "地域";
	}else if(category_name == "こち女（こちじょ）"){
		category_name = "こち女";
	}else if(category_name == "連載企画"){
		category_name = "連載";
	}else if(category_name == "特集まとめ"){
		category_name = "特集";
	}
	$("#newsSecondNavi a").each(function(){
		if($(this).text().replace(/・/g, "").indexOf(category_name) >= 0){
			$(this).closest('li').addClass('active');
			return false;
		}
	});
}
