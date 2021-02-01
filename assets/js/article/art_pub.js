$(function () {
    var layer = layui.layer
    var form = layui.form

    let str = location.search
    str = str.substring(1)
    // console.log(str)

    artEdit()
    // 加载编辑文章的方法
    function artEdit() {
        if (str !== null) {
            // console.log(str)
            // 向服务器发送请求
            let id = str
            $.ajax({
                method: 'GET',
                url: '/my/article/' + id,
                success(res) {
                    if (res.status !== 0) return layer.msg('获取文章列表失败！')
                    setTimeout(() => {
                        $('[name=title]').val(res.data.title)
                        // $('[name=cate_id]').val(res.data.cate_id)
                        $(`option[value=${res.data.cate_id}]`).prop('selected', true)
                        form.render()
                    }, 100)
                    $('[name=content]').val(res.data.content)
                    form.render()
                }
            })
        }
    }

    // 初始化文章分类
    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        // 发送请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) return layer.msg('初始化文章分类失败！')

                // 调用模板引擎渲染下拉列表
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 渲染动态添加的结构一定要调用 form.render() 方法
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为 选择封面 按钮 绑定点击事件
    $('#btnChooseImage').click(function () {
        // 模拟点击文件选择框
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取用户选择的文件
        var files = e.target.files

        // 判断用户是否选择了文件
        if (files.length === 0) return

        // 把用户选择的文件 转换为 url 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 重新初始化剪裁区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义变量 用来记录文章的发布状态  默认是已发布
    var art_state = '已发布'

    // 加入用户点击的是发布按钮，那么表单直接提交，状态时已发布
    // 如果用户点击的时存为草稿，需要先改变发布状态
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').click(function () {
        // 点击存为草稿，改变发布状态
        art_state = '草稿'
    })

    // 监听 form 的 submit 事件
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault()

        // 基于 form 表单，快速创建一个 FormData 对象，需要把元素转换成DOM对象
        var fd = new FormData($(this)[0])

        // 把 文章的发布状态 存到 FormData 对象中去
        fd.append('state', art_state)

        // 将封面裁剪过的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 向服务器发送发布文章 的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是 FormData 格式的数据
            // 必须添加一下两个配置
            contentType: false,
            processData: false,

            success(res) {
                if (res.status !== 0) return layer.msg('发布文章失败！')

                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
                console.log($('[name=title]').val());
                console.log($('[name=cate_id]').val());
                console.log($('[name=content]').val());
            }
        })
    }

})