var relatedsearch = {};

relatedsearch.TITLE_LENGTH = 12;
relatedsearch.TEXT_LENGTH = 12;

relatedsearch.showRelatedArticle = function(param, callback, $target){

	if(!$target){
		$target = $('#relatedSearch1');
	}
	
	if(!$target[0]){
		relatedsearch.show(param, callback);
	}else{
		ats.lazyload($target, function(){
			relatedsearch.show(param, callback);
		});
	}
};

relatedsearch.show = function(param, callback){
	$.ajax({
		url: '/ats-tool/relatedsearch/article.php?' + $.param(param),
		type: 'GET',
		//cache: false,
		dataType: 'json',
		success: function (data, dataType) {
			callback(data);
		},error: function (XMLHttpRequest, textStatus, errorThrown) {
			//alert(textStatus + "\n" + XMLHttpRequest.responseText);
			if(window.console){
				window.console.log(XMLHttpRequest.responseText);
			}
		}
	});
};

relatedsearch.relatedNews = function(list, title, $target){
	var html = '';
	if(list && list.length > 0){
		html += '<section class="sectionListNews">';
		html += '<div class="ttlBasic03">';
		html += '<h3>' + ats.escapeHtml(title) + '<span class="txtNote02">by静岡新聞</span></h3>';
		html += '<!-- /ttlBasic03 --></div>';
		var imageItem = null;
		var startIndex = 0;
		if(relatedsearch.hasImage(list[startIndex])){
			imageItem = list[startIndex];
			startIndex++;
		}
		if(imageItem !== null){
			html += '<ul class="ul_basic02">';
		}else{
			html += '<ul class="ul_basic02" style="width:auto;float:none;">';
		}
		for(var index = startIndex; index < list.length; index++){
			html += '<li>' + relatedsearch.getNewsListItemLayout(list[index]) + '</li>';
		}
		html += '</ul>';
		if(imageItem !== null){
			var img_title = ats.escapeHtml(ats.strip_tags(imageItem['title']));
			html += '<div class="imgDetail01">';
			html += '<figure>';
			html += '<div class="img02"><div><a class="opacityOver" href="' + ats.escapeHtml(relatedsearch.getUrl(imageItem)) + '"><img src="' + relatedsearch.getThumbUrl(imageItem, 150, 120) + '" alt="' + img_title + '" title="' + img_title + '"></a></div></div>';
			html += '</figure>';
			html += '<!-- /imgDetail01 --></div>';
		}
		html += '<!-- /sectionListNews --></section>';
	}
	$target.html(html);
};

relatedsearch.getNewsListItemLayout = function(item){
	var link = ats.escapeHtml(relatedsearch.getUrl(item));
	var title = ats.escapeHtml(ats.strip_tags(item['title']));
	var authored_on = item['published'].substr(0, 16).replace(/-/g, '/').replace(/\/0/g, '/');
	
	var html = '';
	html += '<a href="' + link + '">' + title + '</a>';
	html += '<span class="time01">（' + authored_on + '）</span>';
	if(relatedsearch.hasImage(item)){
		html += '<span><img src="/ats-static/img/common/ico_camera01.png" width="18" height="13" alt="camera"></span>';
	}
	if(relatedsearch.hasMovie(item)){
		var css = 'line-height: 1.2;display: inline-block;';
		if(relatedsearch.hasImage(item)){
			css += 'padding-left:3px;';
		}
		html += '<span style="' + css + '"><img src="/ats-static/img/common/icn_movie.gif" width="18" height="10" alt="movie"></span>';
	}
	return html;
};

relatedsearch.relatedEvent = function(list, title, $target){
	var html = '';
	if(list && list.length > 0){
		//html += '<div class="detailList01 type03 detailListRecommended">';
		html += '<p class="ttlList02 type01">' + ats.escapeHtml(title) + '</p>';
		html += '<ul>';
		
		for(var index = 0; index < list.length; index++){
			var item = list[index];
			var link = ats.escapeHtml(relatedsearch.getUrl(item));
			var title = ats.escapeHtml(ats.strip_tags(item['title']));
			var caption = '';
			var area = '';
			var date = '';
			html += '<li>';
			html += '<figure>';
			html += '<p class="img01">';
			html += '<a class="opacityOver" href="' + link + '">';
			if(relatedsearch.hasImage(item)){
				html += '<img src="' + relatedsearch.getThumbUrl(item, 120, 96) + '" alt="' + caption + '">';
			}
			else {
				// noimage
				var no_image_path = '/ats-static/img/event/pic_default01.jpg';
				html += '<img src="' + ats.getThumbUrl(no_image_path, 120, 96) + '">';
			}
			html += '</a>';
			html += '</p>';
			html += '<figcaption>';
			html += '<p class="area">' + area + '</p>';
			html += '<p><a href="' + link + '">' + title + '</a></p>';
			html += '<p class="limit">' + date + '</p>';
			html += '</figcaption>';
			html += '</figure>';
			html += '</li>';
		}
		html += '</ul>';
		//html += '<!-- /detailList01 --></div>';
	}
	$target.html(html);
};

relatedsearch.relatedBlog = function(list, title, $target){
	var hideGenre = true;
	var html = '';
	if(list && list.length > 0){
		html += '<section class="sectionListBlog">';
		
		html += '<div class="ttlBasic03">';
		html += '<h3>' + ats.escapeHtml(title) + '</h3>';
		html += '<!-- /ttlBasic03 --></div>';
		html += '<ul>';
		for(var index = 0; index < list.length; index++){
			var item = list[index];
			var link = ats.escapeHtml(relatedsearch.getUrl(item));
			var title = ats.escapeHtml(ats.strip_tags(item['title']));
			html += '<li>';
			html +='<div class="detailBox04">';
			if(relatedsearch.hasImage(item)){
				html +='<dl>';
			}else{
				html +='<dl style="float:none;width:660px;">';
			}
			if(hideGenre !== true){
				html +='<dt class="label"><span>' + ats.escapeHtml(relatedsearch.getGenreName(item)) + '</span></dt>';
			}
			if(item['_type'] != 'cats'){
				html +='<dt>[ ' + ats.escapeHtml(item['blog_name']) + ' ]</dt>';
			}
			html +='<dd><a href="' + link + '">' + title + '</a></dd>';
			html +='</dl>';
			if(relatedsearch.hasImage(item)){
				html +='<div class="imgDetail01">';
				html +='<figure>';
				html +='<div class="img02"><p><a class="opacityOver" href="' + link + '"><img src="' + relatedsearch.getThumbUrl(item, 120, 96) + '" alt="' + title + '"></a></p></div>';
				html +='</figure>';
				html +='<!-- /imgDetail01 --></div>';
			}
			html +='<!-- /detailBox04 --></div>';
			html += '</li>';
		}
		html += '</ul>';
		
		html += '<!-- /sectionListBlog --></section>';
	}
	$target.html(html);
};

relatedsearch.relatedLink = function(list, title, $target, hideGenre){
	var html = '';
	if(list && list.length > 0){
		html += '<section class="sectionListBlog">';
		
		html += '<div class="ttlBasic03">';
		html += '<h3>' + ats.escapeHtml(title) + '</h3>';
		html += '<!-- /ttlBasic03 --></div>';
		html += '<ul class="infoType03" id="recommendContainer">';
		for(var index = 0; index < list.length; index++){
		
			var item = list[index];
			var link = ats.escapeHtml(relatedsearch.getUrl(item));
			var cssClassName = '';
			var layout;
			if(item['_type'] == 'cats'){
				switch(item['genre_id']){
					case "4":
						layout = relatedsearch.createEventHtmlLayout(item);
						break;
					case "5":
						layout = relatedsearch.createGourmetHtmlLayout(item);
						break;
					default:
						var title = ats.strip_tags(item['title']);
						var text = item['lead'];
						layout = relatedsearch.createHtmlLayout(item, title, item['lead']);
						break;
				}
				cssClassName = "genre_" + item['genre_id'];
			}else{
				var title = ats.strip_tags(item['blog_name']);
				var text = ats.strip_tags(item['title']);
				layout = relatedsearch.createHtmlLayout(item, title, text);
				cssClassName = "blog_" + item['blog_id'];
			}
			
			var title = ats.escapeHtml(ats.strip_tags(item['title']));
			html += '<li class="' + cssClassName + '">';
			html += '<a href="' + link + '">';
			html += '<dl>';
			if(relatedsearch.hasImage(item)){
				html += '<div><img src="' + relatedsearch.getThumbUrl(item, "auto", 104) + '" alt="' + title + '"></div>';
			}else{
				html += '<div><img src="' + ats.getThumbUrl('/ats-static/img/common/pic_noimage01.jpg', "auto", 104) + '" alt="' + title + '"></div>';
			}
			html += '<dt>' + layout.title + '</dt>'
			html += '<dd>' + layout.text + '</dd>';
			if(hideGenre !== true){
				html +='<dd class="label"><span>' + ats.escapeHtml(relatedsearch.getGenreName(item)) + '</span></dd>';
			}
			html += '</dl>';
			html += '</a>';
			html += '</li>';
		}
		html += '</ul>';
		
		html += '<!-- /sectionListBlog --></section>';
	}
	$target.html(html);
};

relatedsearch.createHtmlLayout = function(item, title, text){
	var title_length = relatedsearch.TITLE_LENGTH * 2 - 1;
	var text_length = relatedsearch.TEXT_LENGTH * 2 - 1;
	/*
	if(!ats.relatedsearchHasImage(item)){
		// 画像が無い場合
		title_length *= 2;
		text_length *= 2;
	}
	*/
	if(text != ""){
		text = ats.ellipsisText(text, text_length);
	}else{
		// テキストが無い場合
		title_length *= 2;
	}
	if(title.length > title_length){
		title = title.substr(0, title_length - 1) + '…';
	}
	return {
		title:ats.escapeHtml(title),
		text:ats.escapeHtml(text)
	};
};

relatedsearch.createGourmetHtmlLayout = function(item){
	var title_length = relatedsearch.TITLE_LENGTH * 2 - 1;
	/*
	if(!ats.relatedsearchHasImage(item)){
		// 画像が無い場合
		title_length *= 2;
	}
	*/
	
	var title = ats.strip_tags(item['title']);
	var text = ''
	
	if(item.gourmet_new_open){
		title = '<span><img src="/ats-static/img/top/txt_new01.gif" width="35" height="16" alt="新店"></span>' + ats.escapeHtml(ats.ellipsisText(title, title_length - 4));
	}else{
		title = ats.escapeHtml(ats.ellipsisText(title, title_length));
	}
	
	text += '<div>' + ats.escapeHtml(item.fields.GOURMET_ARTICLE_ADDRESS1 || '') + '</div>';
	text += '<div class="type01">[ ' + ats.escapeHtml(item.fields.category_name || '') + ' ]</div>';
	return {
		title:title,
		text:text
	};
};

relatedsearch.createEventHtmlLayout = function(item){
	var title_length = relatedsearch.TITLE_LENGTH * 2 - 1;
	var text_width = 160;
	/*
	if(!ats.relatedsearchHasImage(item)){
		// 画像が無い場合
		title_length *= 2;
		text_width = 285;
	}
	*/
	var title = ats.strip_tags(item['title']);
	var text = '';
	var event_date = item.fields.EVENT_ARTICLE_DATE_FREE_AREA || '';
	if(ats.isNullOrEmpty(event_date)){
		if(!ats.isNullOrEmpty(item.fields.EVENT_ARTICLE_START_DATE)){
			event_date += relatedsearch.formatdate(item.fields.EVENT_ARTICLE_START_DATE.substr(0, 10));
		}
		if(!ats.isNullOrEmpty(item.fields.EVENT_ARTICLE_END_DATE) && item.fields.EVENT_ARTICLE_START_DATE != item.fields.EVENT_ARTICLE_END_DATE){
			event_date += "～";
			event_date += relatedsearch.formatdate(item.fields.EVENT_ARTICLE_END_DATE.substr(0, 10));
		}
	}
	
	text += '<div>' + ats.escapeHtml(item.fields.EVENT_ARTICLE_ADDRESS1 || '') + '</div>';
	text += '<div class="type02" style="width:' + text_width + 'px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">' + ats.escapeHtml(event_date || '') + '</div>';
	
	title = ats.escapeHtml(ats.ellipsisText(title, title_length));
	
	return {
		title:title,
		text:text
	};
};

relatedsearch.formatdate = function(d){
	var ary = d.split('/');
	if(ary.length == 3){
		return ary[0] + '年' + parseInt(ary[1], 10) + '月' + parseInt(ary[2], 10) + '日';
	}else{
		return d;
	}
}

relatedsearch.hasImage = function(item){
	return ats.relatedsearchHasImage(item);
};

relatedsearch.hasMovie = function(item){
	return ats.relatedsearchHasMovie(item);
};

relatedsearch.getUrl = function(item){
	return ats.relatedsearchGetUrl(item);
};

relatedsearch.getThumbUrl = function(item, width, height){
	return ats.relatedsearchGetThumbUrl(item, width, height);
};

relatedsearch.getGenreName = function(item){
	return ats.relatedsearchGetGenreName(item);
};

