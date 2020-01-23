// 导入

$(function() {
    // 判断
    init();
    get_user_count();
    get_article_count();

    // 登录请求
    $("#adminLogin").click(function() {
        var iurl = "/login";
        var nurl = "index.html"
        var username = $('#username').val();
        var password = $('#password').val();
        var datas = get_json({ 'username': username, 'password': password })
        $.ajax({
            type: 'post',
            url: get_url(url),
            contentType: "application/json",
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 登录成功
                    save_info("admin_token", str.data.token);
                    save_info("userid", str.data.userinfo.uid);
                    save_info("headpic", str.data.userinfo.headpic);
                    save_info("nickname", str.data.userinfo.nickname);
                    alert("登录成功！");
                    go_next_page(nurl);
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
        var datas = get_json({ 'username': username, 'password': password })
        $.ajax({
            type: 'post',
            url: get_url("/regist"),
            contentType: "application/json",
            data: datas,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 注册成功
                    alert("注册成功！")
                    window.location.reload()
                } else {
                    alert(str.msg)
                    logout()
                }
            },
            fail: function(err, status) {
                alert(err.data);
                console.log(err);
            }
        });
    });

    // 跳转到写教程
    $("#newaritcle").click(function() {
        if (get_info("token") == null) {
            alert("请先登录");
            logout()

            return;
        }
        window.location.href = 'newquestion.html';
    });
});

// 首页初始化方法
function init() {
    var url = "login.html"
    var token = get_info("admin_token")
    if (token == null) {
        // 跳转到首页
        go_next_page(url);
    } else {
        init_user_info()
    }
}

// 获取用户总数
function get_user_count() {
    var url = get_url("/userlist?pagenum=1");
    $.ajax({
        type: 'get',
        url: url,
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 成功
                $('#user_total').text(str.data.usernum); // 总条数

            } else {
                alert(str.msg);
                logout();
            }
        },
        fail: function(err, status) {
            alert(err.data);
            console.log(err);
        }
    });
}


function get_article_count() {
    var url = get_url("/articlelist?pagenum=1");
    $.ajax({
        type: 'get',
        url: url,
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                $('#article_count').text(str.data.articlenum); // 总条数
            } else {
                alert(str.msg);
            }
        },
        fail: function(err, status) {
            alert(err.data);
            console.log(err);
        }
    });
}