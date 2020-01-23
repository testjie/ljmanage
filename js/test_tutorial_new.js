$(function() {
    // 判断
    var editor = init();
    // webloader初始化
    var uploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: true,
        // swf文件路径
        swf: '../lib/webuploader/Uploader.swf',
        // 文件接收服务端。
        server: get_url("/upload"),
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',
        // 只允许选择图片文件。
        withCredentials: true,
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    });

    // 上传成功
    uploader.on('uploadSuccess', function(file, response) {
        var $li = $(
                '<div id="' + file.id + '" name="' + file.name + '" class="file-item thumbnail" style="width:100px;height:100px; display: inline-block;">' +
                '<img src="' + get_img_url(response.data) + '"/>' +
                '<input id="fengmian" type="hidden" value="' + response.data + '"/>' +
                '</div>'
            ),
            $img = $li.find('img');
        // $("#fileList").append($li); // 多图片上传用这个
        $("#fileList").html($li);
        uploader.makeThumb(file, function(error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr('src', src);
        }, 100, 100);
    });

    // 上传失败
    uploader.on('uploadError', function(file) {
        alert("上传失败，请检查服务器！")
    });

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
        var iurl = "/couresnew"
        var title = $("#atitle").val();
        var fenlei = $("#fenlei").val();
        var abrief = $("#abrief").val();
        var content = editor.txt.html();
        var ximg = $("#fengmian").val();

        var datas = get_json({ "title": title, "brief": abrief, "tags": fenlei, "content": content, "ximg": ximg })
        $.ajax({
            url: get_url(iurl),
            type: "POST",
            data: datas,
            headers: get_headers(),
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) {
                if (str.status == 200) {
                    go_next_page("test_tutorial_manage.html");
                } else {
                    alert(str.msg);
                }
            },
            error: function(str) {
                alert("上传失败！")
            }
        });


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
        editor.customConfig.uploadImgServer = upload_url
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