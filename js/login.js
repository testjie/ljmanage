// 导入

$(function() {
    // 判断
    init();

    // 登录请求
    $("#adminLogin").click(function() {
        var iurl = "/adminlogin";
        var nurl = "login.html"
        var username = $('#username').val();
        var password = $('#password').val();
        var datas = get_json({ 'username': username, 'password': password })
        $.ajax({
            type: 'post',
            url: get_url(iurl),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 登录成功
                    save_info("admin_token", str.data.token);
                    save_info("admin_userid", str.data.userinfo.uid);
                    save_info("admin_headpic", str.data.userinfo.headpic);
                    save_info("admin_nickname", str.data.userinfo.nickname);
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

    // 跳转到写教程
    $("#newaritcle").click(function() {
        if (get_info("token") == null) {
            alert("请先登录");
            return;
        }
        window.location.href = 'newquestion.html';
    });
});

// 首页初始化方法
function init() {
    var url = "index.html"
    var token = get_info("admin_token")
    if (token != null) {
        // 跳转到首页
        go_next_page(url);
    }
}