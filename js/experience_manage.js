// 导入

$(function() {
    // 判断
    init();

    // 登录请求
    $("#search").click(function() {
        var nickname = $('#nickname_search').val();
        if (nickname == '') {
            alert("搜索的关键字不能为空!")
            return;
        }
        find(nickname);

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
    var url = "../login.html"
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
    var url = get_url("/articlelist?pagenum=" + page);
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
                var datas = str.data.articlelist;
                for (var i = 0; i < datas.length; i++) {
                    var id = replace_null(datas[i].id);
                    var title = cutstr(replace_null(datas[i].title), 30);
                    var brief = cutstr(replace_null(datas[i].brief), 30);
                    var author = replace_null(datas[i].author);
                    var goods = replace_null(datas[i].goods);
                    var follows = replace_null(datas[i].follows);
                    var createtime = replace_null(datas[i].updatetime);
                    var status = replace_null(datas[i].status);

                    if (status == "0") {
                        status = "正常";
                        var strstatus = "禁用"
                    } else {
                        status = "禁用";
                        var strstatus = "启用"
                    }

                    var c = '<tr>' +
                        '<td>' + id + '</td>' +
                        '<td>' + title + '</td>' +
                        // '<td width="400" style="word-wrap: break-word">' + brief + '</td>' +
                        '<td>' + author + '</td>' +
                        '<td>' + goods + '</td>' +
                        '<td>' + follows + '</td>' +
                        '<td>' + createtime + '</td>' +
                        '<td>' + status + '</td>' +
                        '<td>' +
                        '<label class="badge badge-danger" onclick="preview_items(' + id + ')"style="cursor:pointer;">预览</label>' +
                        '<label class="badge badge-danger"style="cursor:pointer;" onclick="disable_items(' + id + ')">' + strstatus + '</label>' +
                        '<label class="badge badge-danger"style="cursor:pointer;" onclick="deletes(' + id + ',\'/articledelete\')">删除</label>' +
                        '</td>' +
                        '</tr>';

                    tables = tables + c;
                }
                $('#tables').html(tables); // table表格
                $('#total').text(str.data.articlenum); // 总条数
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


// 禁用
function disable_items(id) {
    $.ajax({
        type: 'get',
        url: get_url("/setarticletatus?id=" + id),
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 成功
                init_tables(1);
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
        pres = 1;
    }
    $("#pre").attr("onclick", "init_tables(" + pres + ")");
    $("#next").attr("onclick", "init_tables(" + next + ")");
}

function preview_items(id) {
    alert("即将上线!");
    return;
    go_next_page("experience_preview.html?id=" + id);
}



// 查找
function find(key) {
    var datas = get_json({ "search": key });
    $.ajax({
        type: 'post',
        url: get_url("/usersfindarticle"),
        headers: get_headers(),
        data: datas,
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            // 成功
            if (str.status == 200) {
                // 成功
                var tables = "";
                var datas = str.data;
                for (var i = 0; i < datas.length; i++) {
                    var id = replace_null(datas[i].id);
                    var title = cutstr(replace_null(datas[i].title), 30);
                    var brief = cutstr(replace_null(datas[i].brief), 30);
                    var author = replace_null(datas[i].author);
                    var goods = replace_null(datas[i].goods);
                    var follows = replace_null(datas[i].follows);
                    var createtime = replace_null(datas[i].updatetime);
                    var status = replace_null(datas[i].status);

                    if (status == "0") {
                        status = "正常";
                        var strstatus = "禁用"
                    } else {
                        status = "禁用";
                        var strstatus = "启用"
                    }

                    var c = '<tr>' +
                        '<td>' + id + '</td>' +
                        '<td>' + title + '</td>' +
                        // '<td width="400" style="word-wrap: break-word">' + brief + '</td>' +
                        '<td>' + author + '</td>' +
                        '<td>' + goods + '</td>' +
                        '<td>' + follows + '</td>' +
                        '<td>' + createtime + '</td>' +
                        '<td>' + status + '</td>' +
                        '<td>' +
                        '<label class="badge badge-danger" onclick="preview_items(' + id + ')"style="cursor:pointer;">预览</label>' +
                        '<label class="badge badge-danger"style="cursor:pointer;" onclick="disable_items(' + id + ')">' + strstatus + '</label>' +
                        '<label class="badge badge-danger"style="cursor:pointer;" onclick="deletes(' + id + ',\'/articledelete\')">删除</label>' +
                        '</td>' +
                        '</tr>';

                    tables = tables + c;
                }
                $('#tables').html(tables); // table表格
                $('#total').text(str.data.length); // 总条数
                $("#pre").hide();
                $("#next").hide();
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