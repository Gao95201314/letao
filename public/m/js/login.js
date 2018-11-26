$(function() {
	$('#submit').on('tap', function() {
	/*1. 获取表单序列化数据*/
	/*2.需要有name属性*/
	var data = $('form').serialize();
        console.log(data);
	/*3.发送之前是否有校验*/
	/*4.数据类型是字符串类型，要转成对象形式*/
	 var dataObject = CT.serialize2object(data);
        console.log(dataObject);
		     /*检验*/
        if(!dataObject.username){
            mui.toast('请您输入用户名');
            return false;
        }
        if(!dataObject.password){
            mui.toast('请您输入密码');
            return false;
        }
		 $.ajax({
            type:'post',
            url:'/user/login',
            /*对象 serialize serializeArray*/
            data:dataObject,
            dataType:'json',
            success:function (data) {
                /*如果成功 根据地址跳转*/
                /*如果没有地址 默认跳转个人中心首页*/
                if(data.success == true){
                    /*业务成功*/
                    var returnUrl = location.search.replace('?returnUrl=','');
                    if(returnUrl){
                        location.href = returnUrl;
                    }else{
                        location.href = CT.userUrl;
                    }
                }else{
                    /*业务不成功*/
                    mui.toast(data.message);
                }
            }
        });
    })

});