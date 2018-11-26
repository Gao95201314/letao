$(function() {
	    /*1.一级分类默认渲染 第一个一级分类对应的二级分类*/
	    getFirstCategoryData(function(data) {
		/*一级分类默认渲染 */
		/*模板使用的顺序：json数据，定义模板，调用模板，返回html*/
		$('.cate_left ul').html(template('firstTemplate', data));
		/*绑定事件*/
		initSecondTapHandle();
		/*第一个一级分类对应的二级分类*/
		var categoryId = $('.cate_left ul li:first-child').find('a').attr('data-id');
        
        getSecondCategroyData({
        	id:categoryId
        },function(data){
        /*二级分类渲染*/
       $('.cate_right ul').html(template('secondTemplate', data));
        })
	});
	/*2.点击二级分类加载对应的二级分类*/
	var initSecondTapHandle=function(){
		$('.cate_left').on("tap","a",function(e){
//			console.log(e);
            /*当前选中的时候不去加载*/
            if($(this).parent().hasClass('now')) return false;
            /*添加样式*/
            $('.cate_left li').removeClass('now');
            $(this).parent().addClass('now');
            /*数据的渲染*/
            var categoryId=$(this).attr('data-id');         
//          console.log(cateforyId);
            getSecondCategroyData({
            	id:categoryId
            },function(data){
            	 $('.cate_right ul').html(template('secondTemplate', data));
            })
		});
	}
});
/*获取一级分类的数据*/
var getFirstCategoryData = function(callback) {
	$.ajax({
		url: '/category/queryTopCategory',
		type: 'get',
		data: '',
		dataType: 'json',
		success: function(data) {
			callback && callback(data);
		}
	});
};
/*获取二级分类的数据*/
/*params={id:1}*/
var getSecondCategroyData = function(params,callback) {
	$.ajax({
		url: '/category/querySecondCategory',
		type: 'get',
		data: params,
		dataType: 'json',
		success: function(data) {
			callback && callback(data);
		}
	});	
}