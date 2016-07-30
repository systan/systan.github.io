var ats = {
	// スマホ版のボタン表示
	smphButton:function(smphUrl){
		if(!ats.isSmph()){
			return;
		}
		if(ats.isNullOrEmpty(smphUrl)){
			smphUrl = "/sp/";
		}
		document.write('<div style="text-align:center;padding:2%;background: url(/ats-static/img/common/bgPurple.gif);">');
		document.write('<a href="' + smphUrl + '">');
		document.write('<img src="/ats-static/img/common/btnSP.png">');
		document.write('</a>');
		document.write('</div>');
	},
	isSmph: function(){
		var userAgent = navigator.userAgent;
		return (userAgent.indexOf('iPhone') > 0 && userAgent.indexOf('iPad') < 0) 
			|| userAgent.indexOf('iPod') > 0
			|| userAgent.indexOf('Android') > 0;
	},
	isNullOrEmpty: function(value){
		return (value === null || value === undefined || value === "");
	},
	getAreaCookieValue: function(){
		var cookieValue = ats.getCookie("area");
		if(ats.isNullOrEmpty(cookieValue)){
			return "1";
		}
		return cookieValue;
	},
	getArea2CookieValue: function(){
		var cookieValue = ats.getCookie("area2");
		if(ats.isNullOrEmpty(cookieValue)){
			return "Central";
		}
		return cookieValue;
	},
	getArea2ClassName: function(cookieValue){
		switch(cookieValue){
			case "West":
				return "area2-west";
			case "Central":
				return "area2-central";
			case "East":
				return "area2-east";
			case "Izu":
				return "area2-izu";
			default:
				return "area2-central";
		}
	},
	getCurrentAreaClassName: function(){
		//var cookieValue = $('#haderRegionalDropDown').val();
		var cookieValue = ats.getAreaCookieValue();
		return ats.getAreaClassName(cookieValue);
	},
	getAreaClassName: function(cookieValue){
		switch(cookieValue){
			case "0":
				return "area-west";
			case "1":
				return "area-central";
			case "2":
				return "area-east";
			default:
				return "area-central";
		}
	},
	getClickedAreaClassName: function($element){
		if($element.hasClass("area-west")){
			return "area-west";
		}
		if($element.hasClass("area-central")){
			return "area-central";
		}
		if($element.hasClass("area-east")){
			return "area-east";
		}
		if($element.hasClass("area2-west")){
			return "area2-west";
		}
		if($element.hasClass("area2-central")){
			return "area2-central";
		}
		if($element.hasClass("area2-east")){
			return "area2-east";
		}
		if($element.hasClass("area2-izu")){
			return "area2-izu";
		}
		return "area-not-found";
	},
	setArea: function($container){
		var currentClass = ats.getCurrentAreaClassName();
		ats.setAreaVisible($container, currentClass);
	},
	setAreaVisible: function($container, currentClassName){
		if(currentClassName.indexOf('area2') >= 0){
			$container.find('.area2-selected').not('.' + currentClassName).removeClass('area2-selected').removeClass('current');
			$container.find('.' + currentClassName).addClass('area2-selected').addClass('current');
		}else{
			$container.find('.area-selected').not('.' + currentClassName).removeClass('area-selected').removeClass('current');
			$container.find('.' + currentClassName).addClass('area-selected').addClass('current');
		}
	},
	setCookie: function(key, value, expires){
		$.cookie(key, value, {expires: expires || 500, path: "/"});
	},
	getCookie: function(key){
		return $.cookie(key);
	},
	escapeHtml: function(value){
		if(ats.isNullOrEmpty(value)){
			return value;
		}
		return $('<div />').text(value).html();
	},
	escapeAttr: function(value){
		if(ats.isNullOrEmpty(value) || !value.replace){
			return value;
		}
		value = value.replace(/'/g, '&#39;');
		value = value.replace(/"/g, '&quot;');
		return value;
	},
	htmlText: function(value){
		if(ats.isNullOrEmpty(value)){
			return value;
		}
		return $('<div />').html(value).text();
	},
	getNowloading: function(){
		return '<span class="sys-loading">読み込み中です・・・</span>';
	},
	// ランキングのロード
	// ats.loadRanking({
	//     url: 'ranking.xml', // ランキングXMLのURL ※必須
	//     limit:10, // 件数 ※任意 デフォルト10件
	//     rankingStr:'位', // 順位の後の文字列 ※任意
	//     createItemHtml:function(item){
	//        return "";
	//     }, // 1件分のHTMLを返す関数 ※任意 デフォルトのレイアウトと違う場合に指定
	//     targetElement:$('#list') // 描画対象のjqueryセレクタ ※必須
	//     success:function(){
	//         
	//     }, // ロード成功時の処理 ※任意
	//     errorHandle:function(e){
	//         
	//     }, // エラー時の処理 ※任意
	//     complete:function(e){
	//         
	//     } // 処理終了時の処理 ※任意
	// });
	loadRanking: function(option){
		option.targetElements = {'dummy': option.targetElement};
		ats.loadAccessRankings(option, true);
	},
	loadAccessRankings: function(_option, single){
	
		var rankingStr = _option.rankingStr || '';
		var option = $.extend({
			limit: 10,
			createItemHtml:function(item){
				var html = '';
				html += '<li>';
				html += 	'<dl>';
				html += 		'<dt>' + item.ranking + rankingStr + '</dt>';
				html += 		'<dd><a href="' + ats.escapeAttr(item.url) + '">' + ats.escapeHtml(item.title) + '</a></dd>';
				html += 	'</dl>';
				html += '</li>';
				return html;
			}
		},_option);
		
		if(option.url.indexOf('/') < 0){
			option.url = '/ats-include/ranking/' + option.url;
		}
		
		// エラー処理の定義
		var loadError = function(e){
			if(window.console){
				console.log(e);
			}
			if(option.errorHandle){
				option.errorHandle(e);
			}else{
				var html = '<li><span class="sys-error">読み込みに失敗しました。</span></li>';
				for(var key in option.targetElements){
					option.targetElements[key].html(html);
				}
			}
		};
		
		var loadList = function($parent, key){
			var index = 0;
			var list = [];
			$parent.find('item').each(function(){
				if(++index > option.limit){
					return false;
				}
				var $this = $(this);
				var item = {
					ranking: $this.attr('ranking')
				};
				$this.children().each(function(){
					item[this.tagName] = $(this).text();
				});
				list.push(item);
			});
			
			var length = list.length;
			var html = '';
			for(index = 0; index < length; index++){
				var item = list[index];
				html += option.createItemHtml(item);
			}
			option.targetElements[key].html(html);
			return list;
		};
		
		$.ajax({
			url: option.url,
			type: 'GET',
			dataType: 'xml',
			success: function (data, dataType) {
				try {
					$xml = $(data);
					var obj = {
						ranking:{}
					};
					if(single){
						for(var key in option.targetElements){
							obj.ranking[key] = loadList($xml, key);
						}
					}else{
						$xml.children().children().each(function(){
							var $parent = $(this);
							var key = $parent.attr('parent_id');
							if(key){
								obj.ranking[key] = loadList($parent, key);
							}else{
								obj[this.tagName] = $(this).text();
							}
						});
					}
					
					if(option.sucess){
						option.sucess(obj);
					}
				} catch(e){
					loadError(e);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				loadError(errorThrown);
			},
			complete: function(){
				if(option.complete){
					option.complete();
				}
			}
		});
	},
	getThumbUrl:function(file, width, height, background){
		var url = '/ats-tool/thumb.php?file=' + ats.urlencode(file) + "&width=" + width + "&height=" + height;
		if(background){
			url += '&background=' + background;
		}
		return url;
	},
	getArticleImageUrl:function(article_id, width, height, genre_id){
		var url = "/ats-tool/articleimage.php";
		url += "?article_id=" + article_id;
		if(!ats.isNullOrEmpty(width)){
			url += "&width=" + width;
		}
		if(!ats.isNullOrEmpty(height)){
			url += "&height=" + height;
		}
		if(!ats.isNullOrEmpty(genre_id)){
			url += "&genre_id=" + genre_id;
		}
		return url;
	},
	urlencode: function(value){
		return encodeURIComponent(value);
	},
	writeCharEntities: function(list, num){
		if(!list || !list.length){
			return;
		}
		if(num === undefined || num === null){
			num = 0;
		}
		var length = list.length;
		var str = '';
		for(var index = 0; index < length; index++){
			str += '&#' + (list[index] + num) + ';';
		}
		document.write(str);
	},
	setLocalStrage: function(key, value){
		if(!window.localStorage){
			return;
		}
		localStorage.setItem("ats_" + key, JSON.stringify(value));
	},
	getLocalStrage: function(key){
		if(!window.localStorage){
			return null;
		}
		var value = localStorage.getItem("ats_" + key);
		if(value){
			value = $.parseJSON(value);
		}
		return value;
	},
	removeLocalStrage: function(key){
		if(!window.localStorage){
			return;
		}
		localStorage.removeItem("ats_" + key);
	},
	flatHeight: function($selector){
		var height = 0;
		$selector.each(function(){
			if(height < $(this).height()){
				height = $(this).height();
			}
		});
		if(height > 0){
			$selector.height(height);
		}
	},
	addCategoryHistory: function(genre_id, category_id){
		var categoryHistory = ats.getCategoryHistory();
		if(!categoryHistory[genre_id]){
			categoryHistory[genre_id] = {};
		}
		if(!categoryHistory[genre_id][category_id]){
			categoryHistory[genre_id][category_id] = 1;
		}else{
			categoryHistory[genre_id][category_id]++;
		}
		ats.setCategoryHistory(categoryHistory);
	},
	setCategoryHistory: function(categoryHistory){
		ats.setLocalStrage("categoryHistory", categoryHistory);
	},
	getCategoryHistory: function(){
		try{
			return ats.getLocalStrage("categoryHistory") || {};
		}catch(e){
			return {};
		}
	},
	setRecommendSetting: function(recommendSetting){
		ats.setLocalStrage("recommendSettingAts", recommendSetting);
	},
	getRecommendSetting: function(){
		try{
			return ats.getLocalStrage("recommendSettingAts") || {};
		}catch(e){
			return {};
		}
	},
	getGenreName: function(genre_id){
		switch(genre_id){
			case 1:
				return "アットエス";
			case 2:
				return "ニュース";
			case 3:
				return "スポーツ";
			case 4:
				return "イベント";
			case 5:
				return "グルメ";
			case 6:
				return "映画";
			case 7:
				return "施設";
			case 8:
				return "クーポン";
			case 9:
				return "地図";
			case 10:
				return "静岡新聞の本";
			case 11:
				return "ホットニュース";
			case 12:
				return "テレビ";
			case 13:
				return "ラジオ";
			case 14:
				return "プレスリリース";
			case 15:
				return "応募フォーム";
		}
		return "その他";
	},
	getNoImagePath: function(genre_id){
		switch(genre_id){
			case 4:
				return "/ats-static/img/common/pic_noimage_event01.jpg";
			case 5:
				return "/ats-static/img/common/pic_noimage_gourmet01.jpg";
			case 6:
				return "/ats-static/img/common/pic_noimage_movies01.jpg";
			default:
				return "/ats-static/img/common/pic_noimage_event01.jpg";
		}
		return "その他";
	},
	strip_tags: function(html){
		if(html){
			return html.replace(/(<\w+([^>]*)>)/ig,"");
		}
		return html;
	},
	memberStatusCallback: function(status){
		var status = status || ats.memberStatus;
		if(status.authorized){
			$('.member-login-pc .member-name').text(ats.ellipsisText(status.name, 15));
			$('.member-login-sp .member-name').text(ats.ellipsisText(status.name, 9) + '　様');
			$('.member-login').show();
			$('.member-logout').hide();
			ats.memberStatus = status;
		}else{
			if(!$('.member-login').is(':visible')){
				$('.member-logout').show();
			}
		}
	},
	memberStatus: {
	},
	ellipsisText: function(str, length){
		if(str && str.length > length){
			str = str.substr(0, length - 1) + '…';
		}
		return str;
	},
	lazyload_index: 0,
	lazyload: function($target, callback, offset){
		ats.lazyload_index++;
		
		var eventName = 'appear' + ats.lazyload_index;
		var $window = $(window);
		if(!offset){
			offset = 200;
		}

		$target.one(eventName, function(){
			callback();
		});
		function update(){
			var fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
			if(fold >= $target.offset().top - offset){
				$target.trigger(eventName);
				$window.unbind('scroll.' + eventName).unbind('resize.' + eventName);
			}
		}
		
		$window.bind('scroll.' + eventName, function(){
			update();
		});
		
		$window.bind('resize.' + eventName, function() {
			update();
		});
		
		update();
	},
	getDocHeight: function(){
		return Math.max(
	        $(document).height(),
	        $(window).height(),
	        document.documentElement.clientHeight
	    );
	},
	relatedsearchHasImage: function(item){
		if(item['_type'] == 'cats'){
			return !ats.isNullOrEmpty(item['image_path']);
		}else{
			return true;
		}
	},
	relatedsearchHasMovie: function(item){
		if(item['_type'] == 'cats'){
			return !ats.isNullOrEmpty(item['movie_id']);
		}else{
			return false;
		}
	},
	relatedsearchGetUrl: function(item){
		if(item['_type'] == 'cats'){
			return item['file_path'];
		}else{
			return '/blogs/ats-tool/relatedsearch/mt1_r.php?entry_id=' + item['entry_id'] + '&blog_id=' + item['blog_id'] + '&entry_class=' + item['entry_class'];
		}
	},
	relatedsearchGetThumbUrl: function(item, width, height, background){
		if(item['_type'] == 'cats'){
			var image_path = ats.isNullOrEmpty(item['image_path']) ? ats.getNoImagePath(parseInt(item['genre_id'], 10)): item['image_path'];
			return ats.getThumbUrl(image_path, width, height, background);
		}else{
			var url = '/blogs/ats-tool/relatedsearch/mt1_image.php?entry_id=' + item['entry_id'] + '&blog_id=' + item['blog_id'] + '&entry_class=' + item['entry_class'] + '&width=' + width + '&height=' + height;
			if(background){
				url += '&background=' + background;
			}
			return url;
		}
	},
	relatedsearchGetGenreName: function(item){
		if(item['_type'] == 'cats'){
			return ats.getGenreName(parseInt(item['genre_id'], 10));
		}else{
			return 'ブログ';
		}
	},
	ellipsisText: function(text, length){
		if(ats.isNullOrEmpty(text)){
			return '';
		}
		text = text.replace(/(^\s+)|(\s+$)/g, "");
		text = text.replace(/\s{2,}/g, " ");
		if(text.length > length){
			text = text.substr(0, length) + '…';
		}
		return text;
	}
};
