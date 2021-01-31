$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        // 执行文件选择控件的默认行为
        $('#file').click()
    })


    let layer = layui.layer
    // 为文件选择框绑定 change 事件 用户选择的图片发生变化时触发
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        let filesList = e.target.files // 返回的事件对象 target属性下面的files是一个伪数组
        // 判断用户是否选择了图片
        if (filesList.length === 0) return layer.msg('请选择图片！')

        // 重新渲染裁剪区域
        // 1.拿到用户选择的文件
        let file = filesList[0]
        // 2.将拿到的文件转化伪路径
        let imageUrl = URL.createObjectURL(file)
        // 3.重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域 cropper 中的方法
            .attr('src', imageUrl)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 为上传按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 1.获取用户剪裁过的头像
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2.把头像上传的服务器
        $.ajax({
            method:'POST',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success(res){
                if (res.status !==0) return layer.msg('更换头像失败！')

                layer.msg('更换头像成功！')

                // 调用父页面中的函数，重新渲染用户的信息
                window.parent.getUserInfo()

            }
        })

    })
})