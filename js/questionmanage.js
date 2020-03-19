// 导入

$(function() {
    // 判断
    init();

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
            return;
        }
        window.location.href = 'newquestion.html';
    });
});

// 首页初始化方法
function init() {
    var url = "../../login.html"
    var token = get_info("admin_token")
    if (token == null) {
        // 跳转到首页
        go_next_page(url);
    } else {
        init_user_info();
        init_tables(1);
    }
}

// 初始化table
function init_tables(page) {
    var url = get_url("/questionslist?pagenum=" + page);
    $.ajax({
        type: 'get',
        url: url,
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 成功
                var tables = "";
                var datas = str.data.questionslist;
                for (var i = 0; i < datas.length; i++) {
                    var id = replace_null(datas[i].id);
                    var uid = replace_null(datas[i].uid);
                    var ximg = get_img_url(replace_null(datas[i].ximg));
                    var tags = replace_null(datas[i].tags);
                    var goods = replace_null(datas[i].goods);
                    var title = replace_null(datas[i].title);
                    var brief = replace_null(datas[i].brief);
                    var author = replace_null(datas[i].author);
                    var status = replace_null(datas[i].status);
                    var remark = replace_null(datas[i].remark);
                    var content = replace_null(datas[i].content);
                    var follows = replace_null(datas[i].follows);
                    var collections = replace_null(datas[i].collections);
                    var createtime = replace_null(datas[i].createtime);
                    var updatetime = replace_null(datas[i].updatetime);

                    if (status == 0) {
                        status = "有效"
                    } else {
                        status = "无效"
                    }

                    var c = '<tr>' +
                        '<td class="py-1">' +
                        '<img src="' + ximg + '" alt="image" />' +
                        '</td>' +
                        '<td width="50" style="word-wrap: break-word">' + id + '</td>' +
                        '<td>' + title + '</td>' +
                        '<td width="150" style="word-wrap: break-word">' + brief + '</td>' +
                        '<td width="250" style="word-wrap: break-word">' + content + '</td>' +
                        '<td>' + uid + '</td>' +
                        '<td>' + goods + '</td>' +
                        '<td>' + follows + '</td>' +
                        '<td>' + collections + '</td>' +
                        '<td>' + updatetime + '</td>' +
                        '<td>' +
                        '<label class="badge badge-danger">显示</label><br>' +
                        '<label class="badge badge-danger">删除</label>' +
                        '</td>' +
                        '</tr>';

                    tables = tables + c;
                }
                $('#tables').html(tables); // table表格
                $('#total').text(str.data.questionsnum); // 总条数
                compute_pagenum(page); //计算分页

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


// 计算页面
function compute_pagenum(id) {
    var total = $('#total').text();
    var last = Math.ceil(total / 10);
    var next = id + 1;
    var pres = id - 1;
    if (next > last) {
        next = last;
    }
    if (pres < 1) {
        pres = 1
    }
    $("#pre").attr("onclick", "init_tables(" + pres + ")")
    $("#next").attr("onclick", "init_tables(" + next + ")")
}