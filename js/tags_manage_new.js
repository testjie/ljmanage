// 导入

$(function() {
    // 判断
    init();

    // 登录请求
    $("#commit").click(function() {
        var tags = $('#atitle').val();
        var ctype = $("#select1  option:selected").text();
        if (ctype == "教程") {
            ctype == "0";
        }
        if (ctype == "提问") {
            ctype == "1";
        }
        if (ctype == "灵感") {
            ctype == "2";
        }
        if (ctype == "心得体会") {
            ctype == "3";
        }
        if (tags == '') {
            alert("用户名不能为空!")
            return;
        }
        var datas = get_json({ "ctype": ctype, "tags": tags });
        $.ajax({
            type: 'post',
            url: get_url("/newtags"),
            data: datas,
            headers: get_headers(),
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 成功
                    go_next_page('tags_manage.html');
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



});

// 首页初始化方法
function init() {
    var url = "../login.html"
    var token = get_info("admin_token")
    if (token == null) {
        // 跳转到首页
        go_next_page(url);
    } else {
        init_user_info();
    }
}