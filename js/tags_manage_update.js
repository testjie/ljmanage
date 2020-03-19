// 导入

$(function() {
    // 判断
    init();
    var id = get_id();
    get_tags_info(id);


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
        var datas = get_json({ "id": id, "ctype": ctype, "tags": tags });
        $.ajax({
            type: 'post',
            url: get_url("/updatetags"),
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

// 获取标签信息
function get_tags_info(id) {
    var url = get_url("/gettagslist?id=" + id);
    $.ajax({
        type: 'get',
        url: url,
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 成功
                var ctype = str.data[0].ctype;

                if (ctype == "0") {
                    ctype = "教程";
                }
                if (ctype == "1") {
                    ctype = "提问";
                }
                if (ctype == "2") {
                    ctype = "灵感";
                }
                if (ctype == "3") {
                    ctype = "心得体会";
                }
                $("#atitle").val(str.data[0].tags);
                $("#select1").find("option:contains('" + ctype + "')").attr("selected", true);
            } else {
                alert(str.msg);
                logout()
            }
        },
        fail: function(err, status) {
            alert(err.data);
            console.log(err);
        }
    });
}

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