// const baseurl = "http://192.168.0.103:2333";
// const baseurl = "http://192.144.148.91:2333";
const baseurl = "http://132.232.44.158:2333";
// const baseurl = "http://127.0.0.1:5000";
// const baseurl = "http://132.232.44.158:2333";
const upload_url = baseurl + "/uploadedit";


// 获取全局的地址
function get_url(url) {
    return baseurl + url;
}

// 获取传递的json数据
function get_json(data) {
    return JSON.stringify(data);
}

// 获取headers
function get_headers() {
    return { "token": get_info("admin_token"), "Content-Type": "application/json" };
}

// 保存信息
function save_info(key, value) {
    window.localStorage.setItem(key, value);
}

// 获取信息
function get_info(key) {
    return window.localStorage.getItem(key);
}

// 删除信息
function remove_info(key) {
    localStorage.removeItem(key);
}

// 跳转到下个页面
function go_next_page(url) {
    window.location.href = url;
}

// 重新加载当前页面
function reload_current_page() {
    window.location.reload();
}

// 替换字符串
function replace_null(data) {
    if (data == null) {
        return "";
    } else {
        return data;
    }
}


// 初始化用户信息
function init_user_info() {
    var userimg = get_img_url(get_info("admin_headpic"));
    var username = get_info("admin_nickname");
    var userjob = "超级管理员"
    $("#userimg1").attr("src", userimg);
    $("#userimg2").attr("src", userimg);
    $("#username").text(username);
    $("#realname").text(username);
    $("#job").text(userjob);
}


// 退出
function logout() {
    remove_info("admin_nickname")
    remove_info("admin_headpic")
    remove_info("admin_token")
    remove_info("admin_userid")
    reload_current_page()
}

// 获取图片地址
function get_img_url(imgname) {
    return get_url("/imgs?imgname=" + imgname)
}

// 获取编辑器的图片url
function get_img_content_url(imgname) {
    return get_url("/" + imgname)
}

// 获取网页之间传递的id值
function get_id() {
    return window.location.href.split('=')[1].replace('#', '');
}