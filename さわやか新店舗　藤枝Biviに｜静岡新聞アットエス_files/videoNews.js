// ====================================================================================================
// 動画ニュース
//    @param $container   htmlタグのid
//    @param $width       表示幅
//    @param $genre       表示場所（ATS・SBSTV・SP_NEWSTOP）
//
// ====================================================================================================
function loadMovieNews($container, $width, $genre){

	// --------------------------------------------------
	// 処理実行
	// --------------------------------------------------
	xmlLoad();

	// --------------------------------------------------------------------------------------------------
	// XML読み込み
	// --------------------------------------------------------------------------------------------------
	function xmlLoad(){
		$xml_file = "/ats-include/sbstv/videonews/videoNewsSbs.xml";
		$.ajax({
			url:$xml_file,
			type:'get',
			dataType:'xml',
			timeout:10000,
			success:parse_xml
		});
	}

	// --------------------------------------------------------------------------------------------------
	// XMLデータを取得
	// --------------------------------------------------------------------------------------------------
	function parse_xml($xml, $status){
		var $ret = "";

		if($status!='success')return;


		// -------------------------------------------------
		// 出力用HTML
		// -------------------------------------------------
		$ret = outHtmlDaily($xml);

		// -------------------------------------------------
		// HTMLを生成
		// -------------------------------------------------
		$($ret).appendTo($container);
	}

	// --------------------------------------------------------------------------------------------------
	// 出力用HTML
	// --------------------------------------------------------------------------------------------------
	function outHtmlDaily($xml){
		var $ret = "";
		var $arr = new Array();

		// --------------------------------------------------
		// Dateオブジェクトを生成
		// --------------------------------------------------
		var $now = new Date();

		$cnt = 0;
		// --------------------------------------------------
		// <items>タグ
		// --------------------------------------------------
		$($xml).find('items').each(function(){
			var $el_items = $(this);
			// --------------------------------------------------
			// <item>タグ分繰り返す
			// --------------------------------------------------
			$el_items.find('item').each(function(){
				$el_item = $(this);

				// --------------------------------------------------
				// 値の取得
				// --------------------------------------------------
				var $date = $el_item.attr('date');						// 日付
				var $video_id = $el_item.find('video_id').text();		// video_id
				var $title = $el_item.find('title').text();				// title
				var $url = $el_item.find('url').text();					// url

				// --------------------------------------------------
				// 出力値を配列に格納
				// --------------------------------------------------
				$arr[$cnt] = new Array();
				$arr[$cnt]["date"] = $date;
				$arr[$cnt]["video_id"] = $video_id;
				$arr[$cnt]["title"] = $title;
				$arr[$cnt]["url"] = $url;

				// --------------------------------------------------
				// 出力カウントアップ
				// --------------------------------------------------
				$cnt = $cnt + 1;

				// --------------------------------------------------
				// 3件を超えたら処理を抜ける
				// --------------------------------------------------
				if($cnt >= 3){
					 return false;
				}
			});
		});
		// -------------------------------------------------
		// HTMLを生成
		// -------------------------------------------------
		if($arr.length>0){
			if($genre==="SP_NEWSTOP"){
				// var objDate = new Date($arr[0]["date"]);
				// y = objDate.getFullYear();
				// m = objDate.getMonth()+1;
				// d = objDate.getDate();
			
				//$ret = $ret + "<p class=\"movieTit\">" + $arr[0]["title"] + "（" + m + "月" + d + "日撮影）</p>";
				$ret = $ret + "<p class=\"movieTit\">" + $arr[0]["title"] + "</p>";
				$ret = $ret + "<div class=\"movieIn\">";
				$ret = $ret + "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/" + $arr[0]["video_id"] + "?rel=0\" frameborder=\"0\" allowfullscreen=\"\" class=\"lastChild empty\"></iframe>";
				$ret = $ret + "</div>";
			}else if($genre==="SBSTV"){
				$ret = $ret + "<div class=\"movienews-img\" style=\"width:" + $width + ";background:#000;text-align:center;\">";
				$ret = $ret + 	"<a href=\"/sbstv/videonews/index.html?id=" + $arr[0]["video_id"] + "\" style=\"padding:0;\">";
				$ret = $ret + 		"<img src=\"" + $arr[0]["url"] + "\" width=\"200px\">";
				$ret = $ret + 	"</a>";
				$ret = $ret + "</div>";
				for(var i=0; i<$cnt; i++){
					$ret = $ret + "<p><span id=\"SBS_TvMovieNews_lblMovieTitle1\">";
					$ret = $ret + "<a href=\"/sbstv/videonews/index.html?id=" + $arr[i]["video_id"] + "\">" + $arr[i]["title"] + "</a>";
					$ret = $ret + "</span></p>";
				}
				$ret = $ret + "<!-- " + $now + " -->";
			}else{
				$ret = $ret + "<div class=\"imgVideo01\">";
				$ret = $ret + 	"<a href=\"/sbstv/videonews/index.html?id=" + $arr[0]["video_id"] + "\">";
				$ret = $ret + 		"<img src=\"" + $arr[0]["url"] + "\" width=\"" + $width + "\" alt=\"dummy\"></a>";
				$ret = $ret + 	"</a>";
				$ret = $ret + "</div>";
				$ret = $ret + "<ul class=\"sbsTvList01\">";
				for(var i=0; i<$cnt; i++){
					$ret = $ret + "<li><a href=\"/sbstv/videonews/index.html?id=" + $arr[i]["video_id"] + "\">" + $arr[i]["title"] + "</a></li>";
				}
				$ret = $ret + "</ul>";
			}
		}
		return $ret;
	}

}



