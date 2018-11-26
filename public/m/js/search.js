$(function(){
	$('.ct_search a').on('tap',function(){
		/*页面的跳转，跳转到页面的搜索列表，并且带上关键字*/
		var key=$.trim($('input').val());
		/*判断   没有关键字就提示用户输入关键字*/
		if(!key){
			/*mui提供的消息提示*/
			 mui.toast('请输入关键字');
			 return false;
		}
		/*如果合法*/
		/*searchList?key=xxx*/
		location.href='searchList.html?key='+key;
	})
})
