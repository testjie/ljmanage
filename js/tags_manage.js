// 导入

$(function() {
    // 判断
    init();

    // 登录请求
    $("#search").click(function() {
        alert("就这么几个标签都好想要搜索？")
        return;
        var nickname = $('#nickname_search').val();
        if (nickname == '') {
            alert("用户名不能为空!")
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
    var url = get_url("/gettagslist");
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
                var datas = str.data;
                for (var i = 0; i < datas.length; i++) {
                    var id = replace_null(datas[i].id);
                    var tags = replace_null(datas[i].tags);
                    var updatetime = cutstr(replace_null(datas[i].updatetime), 30);
                    var status = replace_null(datas[i].status);
                    var ctype = replace_null(datas[i].ctype);

                    if (status == "0") {
                        status = "有效";
                        var strstatus = "禁用";
                    } else {
                        status = "无效";
                        var strstatus = "启用";
                    }


                    if (ctype == "0") {
                        ctype = "教程";
                    }
                    if (ctype == "1") {
                        ctype = "问题";
                    }
                    if (ctype == "2") {
                        ctype = "灵感";
                    }
                    if (ctype == "3") {
                        ctype = "心得";
                    }


                    var c = '<tr>' +
                        '<td>' + id + '</td>' +
                        // '<td width="600" style="word-wrap: break-word">' + tags + '</td>' +
                        '<td width="600" style="word-wrap: break-word">';

                    var itags = tags.split(',');
                    for (j = 0; j < itags.length; j++) {
                        c = c + '<label class="badge badge-danger" style="cursor:pointer; ">' + itags[j] + '</label>';
                    }

                    c = c + '</td>' +
                        // '<td width="200" style="word-wrap: break-word">' + content + '</td>' +
                        '<td>' + ctype + '</td>' +
                        '<td>' + updatetime + '</td>' +
                        '<td>' + status + '</td>' +
                        '<td>' +
                        '<label class="badge badge-danger" onclick="add_items(' + id + ')"style="cursor:pointer;">新增</label>' +
                        '<label class="badge badge-danger" onclick="update_items(' + id + ')"style="cursor:pointer;">修改</label>' +
                        '<label class="badge badge-danger"style="cursor:pointer;" onclick="disable_items(' + id + ')">' + strstatus + '</label>' +
                        '<label class="badge badge-danger"style="cursor:pointer;" onclick="delete_items(' + id + ',\'/questionsdelete\')">删除</label>' +
                        '</td>' +
                        '</td>' +
                        '</tr>';

                    tables = tables + c;
                }
                var count = str.data.length;
                $('#tables').html(tables); // table表格
                $('#total').text(count); // 总条数
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


// 新增
function add_items(id) {
    go_next_page('tags_manage_new.html');
}

// 修改
function update_items(id) {
    go_next_page('tags_manage_update.html?id=' + id);
}

// 禁用
function disable_items(id) {
    $.ajax({
        type: 'get',
        url: get_url("/settagstatus?id=" + id),
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 成功
                alert("操作成功！");
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

// 删除
function delete_items(id) {
    var ids = id + ',';
    var url = get_url("/deletetags");
    var datas = get_json({ "dlist": ids });
    $.ajax({
        type: 'post',
        url: url,
        headers: get_headers(),
        data: datas,
        dataType: "json",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 成功
                alert("操作成功！");
                init_tables(1);
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
    $("#pre").attr("onclick", "init_tables(" + pres + ")");
    $("#next").attr("onclick", "init_tables(" + next + ")");
}


// 禁用教程
function disable_lbt(id) {
    var datas = get_json({ "tid": id });
    $.ajax({
        type: 'post',
        url: get_url("/deletetitleimg"),
        headers: get_headers(),
        data: datas,
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

function edit_lbt(id) {
    go_next_page('rotation_chart_manage_edit.html?id=' + id);

}


// 推荐教程
function recommend_course(id) {
    alert(id);
}

// 编辑教程
function edit_course(id) {
    go_next_page("test_tutorial_edit.html?id=" + id);
}

// 查找用户
function find(key) {
    var datas = get_json({ "title": key });
    $.ajax({
        type: 'post',
        url: get_url("/usersfindcoures"),
        headers: get_headers(),
        data: datas,
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 成功
                var tables = "";
                var datas = str.data;
                for (var i = 0; i < datas.length; i++) {
                    var id = replace_null(datas[i].id);
                    var title = cutstr(replace_null(datas[i].title), 30);
                    var content = cutstr(replace_null(datas[i].content), 30);
                    var url = cutstr(replace_null(datas[i].rurl), 30);
                    var updatetime = cutstr(replace_null(datas[i].updatetime), 30);
                    var status = replace_null(datas[i].status);

                    if (status == "0") {
                        status = "有效";
                        var strstatus = "禁用";
                    } else {
                        status = "无效";
                        var strstatus = "启用";
                    }

                    var c = '<tr>' +
                        '<td>' + id + '</td>' +
                        '<td width="200" style="word-wrap: break-word">' + title + '</td>' +
                        // '<td width="200" style="word-wrap: break-word">' + content + '</td>' +
                        '<td>' + url + '</td>' +
                        '<td>' + updatetime + '</td>' +
                        '<td>' + status + '</td>' +
                        '<td>' +
                        '<label class="badge badge-danger"onclick="edit_lbt(' + id + ')" style="cursor:pointer;">编辑</label>' +
                        '<label class="badge badge-danger" onclick="disable_lbt(' + id + ')" style="cursor:pointer;">' + strstatus + '</label>' +
                        // '<label class="badge badge-danger"onclick="recommend_course(' + id + ')" style="cursor:pointer;">推荐</label>' +
                        '</td>' +
                        '</td>' +
                        '</tr>';

                    tables = tables + c;
                }
                var count = str.data.length;
                $('#tables').html(tables); // table表格
                $('#total').text(count); // 总条数
                // compute_pagenum(page); //计算分页
                $("#pre").hide();
                $("#next").hide();
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