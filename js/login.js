// 导入
import * as config from './config.js';

$(function() {
    // 判断
    init();

    // 登录请求
    $("#adminLogin").click(function() {
        var iurl = "/login";
        var nurl = "index.html"
        var username = $('#username').val();
        var password = $('#password').val();
        var datas = config.get_json({ 'username': username, 'password': password })
        $.ajax({
            type: 'post',
            url: config.get_url(url),
            contentType: "application/json",
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 登录成功
                    config.save_info("admin_token", str.data.token);
                    config.save_info("userid", str.data.userinfo.uid);
                    config.save_info("headpic", str.data.userinfo.headpic);
                    config.save_info("nickname", str.data.userinfo.nickname);
                    alert("登录成功！");
                    config.go_next_page(nurl);
                } else {
                    alert(str.msg);
                }
            },
            fail: function(err, status) {
                alert(err.data);
                console.log(err);
            }
        });
    });


    // 用户注册
    $("#userReg").click(function() {
        var username = $('#username1').val();
        var password = $('#password1').val();
        var datas = config.get_json({ 'username': username, 'password': password })
        $.ajax({
            type: 'post',
            url: config.get_url("/regist"),
            contentType: "application/json",
            data: datas,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 注册成功
                    alert("注册成功！")
                    window.location.reload()
                } else {
                    alert(str.msg);
                }
            },
            fail: function(err, status) {
                alert(err.data);
                console.log(err);
            }
        });
    });

    // 跳转到写文章
    $("#newaritcle").click(function() {
        if (config.get_info("token") == null) {
            alert("请先登录");
            return;
        }
        window.location.href = 'newquestion.html';
    });
});

// 首页初始化方法
function init() {
    var url = "index.html"
    var token = config.get_info("admin_token")
    if (token != null) {
        // 跳转到首页
        config.go_next_page(url);
    }
}