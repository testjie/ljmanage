$(function() {
    alert(get_url("/login"))
        // 登录请求
    $("#adminLogin").click(function() {
        var iurl = "/login";
        var nurl = "index.html";
        var username = $('#username').val();
        var password = $('#password').val();
        var datas = config.get_json({ 'username': username, 'password': password });
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

    // 跳转到写教程
    $("#test").click(function() {
        var a = editor.getMarkdown();
        alert(a)
    });
});

// 首页初始化方法
function init() {
    var url = "login.html"
    var token = config.get_info("admin_token")
    if (token != null) {
        // 跳转到首页
        config.go_next_page(url);
    } else {
        // 初始化
        // init_pagging();
    }
}


// 初始化翻页
function init_pagging() {
    $("#pager").zPager({
        totalData: 50,
        htmlBox: $('#wraper'),
        btnShow: true,
        ajaxSetData: false
    });

    function currentPage(currentPage) {
        /*
            触发页码数位置： Page/js/jquery.z-pager.js 64行
        */
        console.log("当前页码数：" + currentPage);
    }
}