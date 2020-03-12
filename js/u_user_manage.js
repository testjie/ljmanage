// 导入

$(function() {
    // 判断
    init();

    // 登录请求
    $("#search").click(function() {
        var nickname = $('#nickname_search').val();
        if (nickname == '') {
            alert("用户名不能为空!")
            return;
        }
        find_user(nickname);
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
    var url = get_url("/userlist?pagenum=" + page);
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
                for (var i = 0; i < str.data.userlist.length; i++) {
                    var id = replace_null(str.data.userlist[i].id);
                    var qq = replace_null(str.data.userlist[i].QQ);
                    var job = replace_null(str.data.userlist[i].job);
                    var sex = replace_null(str.data.userlist[i].sex);
                    var phone = replace_null(str.data.userlist[i].phone);
                    var status = replace_null(str.data.userlist[i].status);
                    var weixin = replace_null(str.data.userlist[i].weixin);
                    var username = replace_null(str.data.userlist[i].nickname);
                    var address = replace_null(str.data.userlist[i].address);
                    var headpic = replace_null(get_img_url(str.data.userlist[i].headpic));

                    if (status == 0) {
                        status = "正常"
                    }

                    if (status == 1) {
                        status = "已删除"
                    }

                    if (status == 2) {
                        status = "锁定"
                    }

                    if (status == 3) {
                        status = "冻结"
                    }

                    var c = '<tr>' +
                        '<td class="py-1">' +
                        '<img src="' + headpic + '" alt="image" />' +
                        '</td>' +
                        '<td>' + username + '</td>' +
                        '<td>' + sex + '</td>' +
                        '<td>' + phone + '</td>' +
                        '<td>' + job + '</td>' +
                        '<td>' + weixin + '</td>' +
                        '<td>' + qq + '</td>' +
                        '<td>' + address + '</td>' +
                        '<td>' + status + '</td>' +
                        '<td>' +
                        '<label class="badge badge-danger" style="cursor:pointer;" onclick="freeze_user(' + id + ')">冻结</label>' +
                        '<label class="badge badge-danger" style="cursor:pointer;" onclick="deletes(' + id + ',\'/usersdelete\')">删除</label>' +
                        '</td>' +
                        '</tr>';

                    tables = tables + c;
                }
                // $('#tables').html(""); // table表格
                $('#tables').html(tables); // table表格
                $('#total').text(str.data.usernum); // 总条数
                compute_pagenum(page); //计算分页

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

// 冻结用户
function freeze_user(id) {
    var ids = id + ',';
    var url = get_url("/usersfreeze");
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

// 查找用户
function find_user(key) {
    var datas = get_json({ "username": key });
    $.ajax({
        type: 'post',
        url: get_url("/usersfind"),
        headers: get_headers(),
        data: datas,
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 成功
                var tables = "";
                for (var i = 0; i < str.data.length; i++) {
                    var id = replace_null(str.data[i].id);
                    var qq = replace_null(str.data[i].QQ);
                    var job = cutstr(replace_null(str.data[i].job), 30);
                    var sex = replace_null(str.data[i].sex);
                    var phone = replace_null(str.data[i].phone);
                    var status = replace_null(str.data[i].status);
                    var weixin = replace_null(str.data[i].weixin);
                    var username = cutstr(replace_null(str.data[i].nickname), 30);
                    var address = cutstr(replace_null(str.data[i].address), 30);
                    var headpic = replace_null(get_img_url(str.data[i].headpic));

                    if (status == 0) {
                        status = "正常"
                    }

                    if (status == 1) {
                        status = "已删除"
                    }

                    if (status == 2) {
                        status = "锁定"
                    }

                    if (status == 3) {
                        status = "冻结"
                    }

                    var c = '<tr>' +
                        '<td class="py-1">' +
                        '<img src="' + headpic + '" alt="image" />' +
                        '</td>' +
                        '<td>' + username + '</td>' +
                        '<td>' + sex + '</td>' +
                        '<td>' + phone + '</td>' +
                        '<td>' + job + '</td>' +
                        '<td>' + weixin + '</td>' +
                        '<td>' + qq + '</td>' +
                        '<td>' + address + '</td>' +
                        '<td>' + status + '</td>' +
                        '<td>' +
                        '<label class="badge badge-danger" style="cursor:pointer;" onclick="freeze_user(' + id + ')">冻结</label>' +
                        '<label class="badge badge-danger" style="cursor:pointer;" onclick="deletes(' + id + ',\'/usersdelete\')">删除</label>' +
                        '</td>' +
                        '</tr>';

                    tables = tables + c;
                }
                // $('#tables').html(""); // table表格
                $('#tables').html(tables); // table表格
                $('#total').text(str.data.usernum); // 总条数
                // compute_pagenum(page); //计算分页
                $("#pre").hide();
                $("#next").hide();

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