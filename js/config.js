// export const baseurl = "http://192.168.0.103:5000"
export const baseurl = "http://192.144.148.91:2333"
    // export const baseurl = "http://127.0.0.1:5000"


// 获取全局的地址
export function get_url(url) {
    return baseurl + url;
}

// 获取传递的json数据
export function get_json(data) {
    return JSON.stringify(data);
}

// 获取headers
export function get_headers() {
    return { "token": get_info("token") };
}

// 保存信息
export function save_info(key, value) {
    window.localStorage.setItem(key, value);
}

// 获取信息
export function get_info(key) {
    return window.localStorage.getItem(key);
}

// 跳转到下个页面
export function go_next_page(url) {
    window.location.href = url;
}

// 重新加载当前页面
export function reload_current_page() {
    window.location.reload();
}