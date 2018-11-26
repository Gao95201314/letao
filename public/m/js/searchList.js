$(function() {
	mui('.mui-scroll-wrapper').scroll({
		indicators: false, //是否显示滚动条
	});
	/*1.页面初始化的时候：关键字在输入框显示*/
	/*获取关键字*/
	var urlParams = CT.getParamsByUrl();
	var $input = $("input").val(urlParams.key || '');
	/*2.页面初始化的时候：根据关键字查询第一页数据4条*/
	/*下拉刷新配置自动执行*/
	/*	getSearchData({
				proName: $input.val(),
				page: 1,
				pageSize: 4
			}, function(data) {
				//数据渲染
				$('.ct_product').html(template('list', data));
			})*/

	/*3.用户点击搜索的时候，根据的关键字搜索商品 重置排序功能 */
	$(".ct_search a").on("tap", function() {
		var key = $.trim($input.val());
		if (!key) {
			mui.toast('请输入关键字');
			return false;
		}
		getSearchData({
			proName: key,
			page: 1,
			pageSize: 4
		}, function(data) {
			/*渲染数据*/
			$('.ct_product').html(template('list', data));
		})
	})

	/*4.用户点击排序的时候， 根据排序的选项去进行排序（默认的时候是降序） 再次点击时，就是升序*/
	$('.ct_order a').on("tap", function() {
			/*当前点击a*/
			var $this = $(this);
			/*如果之前没有选择*/
			if (!$this.hasClass('now')) {
				/*选中，并且其他的不选中，箭头默认朝下*/
				$this.addClass('now').siblings().removeClass('now')
					.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
				/*有now的时候*/
			} else {
				/*如果已经被选中，改变箭头的方向*/
				if ($this.addClass('now')) {
					if ($this.find('span').hasClass('fa-angle-down')) {
						$this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
					} else {
						$this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
					}
				}
			}
			/*获取当前点击的功能参数 price 1 2 num 1 2*/
			var order = $this.attr("data-order");
			var orderValue = $this.find("span").hasClass('fa-angle-up') ? 1 : 2;

			var key = $.trim($input.val());
			if (!key) {
				mui.toast('请输入关键字');
				return false;
			}

			/*获取数据*/
			var params = {
				proName: key,
				page: 1,
				pageSize: 4,
				/*排序的方式*/
			};
			params[order] = orderValue;
			getSearchData(params, function(data) {
				$('.ct_product').html(template('list', data));
			})
		})
		/*5.用户下拉的时候  根据当前条件刷新 上拉加载重置 排序功能也要重置*/
	mui.init({
		pullRefresh: {
			/*下拉的容器*/
			container: "#refreshContainer",
			contentrefresh: "正在加载...",
			contentnomore: '没有更多数据了',
			/*下拉刷新*/
			down: {
				/*最近更新的功能*/
				/*style:'circle',*/
				/*自动加载*/
				auto: true,
				callback: function() {
					/*组件对象*/
					var that = this;
					var key = $.trim($input.val());
					if (!key) {
						mui.toast('请输入关键字');
						return false;
					}
					/*排序功能也要重置*/
					$('.ct_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
					getSearchData({
						proName: key,
						page: 1,
						pageSize: 4
							/*排序功能需不需要带上*/
					}, function(data) {
						setTimeout(function() {
							/*渲染数据*/
							$('.ct_product').html(template('list', data));
							/*停止下拉刷新*/
							that.endPulldownToRefresh();
							/*上拉加载重置*/
							that.refresh(true);
						}, 2000);
					});
				}
			},
			/*上拉*/
			up: {
				callback: function() {
					window.page++;
					/*组件对象*/
					var that = this;
					var key = $.trim($input.val());
					if (!key) {
						mui.toast('请输入关键字');
						return false;

					}
					/*获取当前点击的功能参数 price 1 2 num 1 2*/
					var order = $('.ct_order a.now').attr("data-order");
					var orderValue = $('.ct_order a.now').find("span").hasClass('fa-angle-up') ? 1 : 2;
					/*获取数据*/
					var params = {
						proName: key,
						page: window.page,
						pageSize: 4,
						/*排序的方式*/
					};
					params[order] = orderValue;
					getSearchData(params,function(data) {
						setTimeout(function() {
							/*渲染数据*/
							$('.ct_product').append(template('list', data));
							/*停止上拉刷新*/
							if (data.data.length) {
								that.endPullupToRefresh();
							} else {
								that.endPullupToRefresh(true);
							}
						}, 2000);
					});
				}
			}
		}
	});
	/*6。当用户上拉的时候，要加载下页（没有数据了，不去加载操作了）*/
});
var getSearchData = function(params, callback) {
	$.ajax({
		type: "get",
		url: "/product/queryProduct",
		async: true,
		data: params,
		dataType: "json",
		success: function(data) {
			/*存一个当前页码*/
			window.page = data.page;
			callback && callback(data);
		}
	});
}