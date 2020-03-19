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
                    var title = cutstr(replace_null(datas[i].title), 30);
                    var brief = replace_null(datas[i].brief);
                    var author = replace_null(datas[i].author);
                    var status = replace_null(datas[i].status);
                    var remark = replace_null(datas[i].remark);
                    var content = replace_null(datas[i].content);
                    var follows = replace_null(datas[i].follows);
                    var collections = replace_null(datas[i].collections);
                    var createtime = replace_null(datas[i].createtime);
                    var updatetime = replace_null(datas[i].updatetime);

                    if (status == "0") {
                        status = "正常";
                        var strstatus = "禁用"
                    } else {
                        status = "禁用";
                        var strstatus = "启用"
                    }

                    var c = '<tr>' +
                        '<td  style="word-wrap: break-word">' + id + '</td>' +
                        // '<td class="py-1">' +
                        // '<img src="' + ximg + '" alt="image" />' +
                        // '</td>' +
                        '<td style="width:300px;">' + title + '</td>' +
                        // '<td width="150" style="word-wrap: break-word">' + brief + '</td>' +
                        // '<td width="250" style="word-wrap: break-word">' + content + '</td>' +
                        '<td>' + author + '</td>' +
                        '<td>' + goods + '</td>' +
                        '<td>' + follows + '</td>' +
                        // '<td>' + collections + '</td>' +
                        '<td>' + updatetime + '</td>' +
                        '<td>' + status + '</td>' +

                        '<td>' +
                        '<label class="badge badge-danger" onclick="preview_items(' + id + ')"style="cursor:pointer;">预览</label>' +
                        '<label class="badge badge-danger"style="cursor:pointer;" onclick="disable_items(' + id + ')">' + strstatus + '</label>' +
                        '<label class="badge badge-danger"style="cursor:pointer;" onclick="deletes(' + id + ',\'/questionsdelete\')">删除</label>' +
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



// 禁用
function disable_items(id) {
    $.ajax({
        type: 'get',
        url: get_url("/setquestiontatus?id=" + id),
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

// 预览
function preview_items(id) {
    alert("即将上线!");
    return;
    go_next_page("experience_preview.html?id=" + id);
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

// 查找
function find(key) {
    var datas = get_json({ "search": key });
    $.ajax({
        type: 'post',
        url: get_url("/usersfindquestions"),
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
                    var uid = replace_null(datas[i].uid);
                    var ximg = get_img_url(replace_null(datas[i].ximg));
                    var tags = replace_null(datas[i].tags);
                    var goods = replace_null(datas[i].goods);
                    var title = cutstr(replace_null(datas[i].title), 30);
                    var brief = replace_null(datas[i].brief);
                    var author = replace_null(datas[i].author);
                    var status = replace_null(datas[i].status);
                    var remark = replace_null(datas[i].remark);
                    var content = replace_null(datas[i].content);
                    var follows = replace_null(datas[i].follows);
                    var collections = replace_null(datas[i].collections);
                    var createtime = replace_null(datas[i].createtime);
                    var updatetime = replace_null(datas[i].updatetime);

                    if (status == "0") {
                        status = "正常";
                        var strstatus = "禁用"
                    } else {
                        status = "禁用";
                        var strstatus = "启用"
                    }

                    var c = '<tr>' +
                        '<td  style="word-wrap: break-word">' + id + '</td>' +
                        // '<td class="py-1">' +
                        // '<img src="' + ximg + '" alt="image" />' +
                        // '</td>' +
                        '<td style="width:300px;">' + title + '</td>' +
                        // '<td width="150" style="word-wrap: break-word">' + brief + '</td>' +
                        // '<td width="250" style="word-wrap: break-word">' + content + '</td>' +
                        '<td>' + author + '</td>' +
                        '<td>' + goods + '</td>' +
                        '<td>' + follows + '</td>' +
                        // '<td>' + collections + '</td>' +
                        '<td>' + updatetime + '</td>' +
                        '<td>' + status + '</td>' +

                        '<td>' +
                        '<label class="badge badge-danger" onclick="preview_items(' + id + ')"style="cursor:pointer;">预览</label>' +
                        '<label class="badge badge-danger"style="cursor:pointer;" onclick="disable_items(' + id + ')">' + strstatus + '</label>' +
                        '<label class="badge badge-danger"style="cursor:pointer;" onclick="deletes(' + id + ',\'/questionsdelete\')">删除</label>' +
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