$(function() {
    // 判断
    var editor = init();

    // 上传文章标题图片
    $("#acommit").click(function() {
        var iurl = "/upload";
        var formData = new FormData($('#uploadForm')[0]);
        $.ajax({
            url: get_url(iurl),
            type: "POST",
            data: formData,
            async: true,
            cashe: false,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            contentType: false,
            processData: false,
            success: function(str) {
                if (str.status == 200) {
                    $("#aimgyl").attr("src", get_img_url(str.data))
                    $("#aimgyl").removeAttr("hidden");
                    alert("上传成功")
                } else {
                    alert(str.msg)
                }
            },
            error: function(str) {
                alert("上传失败！")
            }
        });
    });

    // 写文章
    $("#commit").click(function() {
        var title = $("#atitle")
        var fenlei = $("#fenlei").val()
        var abrief = $("#abrief").val()
        var content = editor.txt.html()

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
        var E = window.wangEditor
        var editor = new E('#editor')
        editor.customConfig.uploadImgServer = 'http://127.0.0.1:5000/testupload'
        editor.customConfig.uploadImgMaxSize = 20 * 1024 * 1024
        editor.customConfig.uploadFileName = 'file'
        editor.customConfig.withCredentials = true
        editor.customConfig.uploadImgHooks = {
            fail: function(xhr, editor, result) {
                alert("插入图片上失败")
            },
            error: function(xhr, editor) {
                alert("插入图片报错了，请检查后端服")
            },
            timeout: function(xhr, editor) {
                alert("插入图片超时")
            },
            customInsert: function(insertImg, result, editor) {
                var url = result.data // 图片地址
                insertImg(get_img_url(url)) // 插入图片
            }
        }
    }
    editor.create()
    return editor
}