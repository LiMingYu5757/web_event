$(function () {

    // 获取layui 中的 form对象 layer对象
    var form = layui.form
    var layer = layui.layer
    // 自定义校验规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo()
    // 初始化用户信息
    function initUserInfo() {
        // 发送 ajax 请求
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success(res) {
                if (res.status !== 0) return layer.msg('获取用户信息失败！')

                // console.log(res);
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 监听表单的提交事件
    $('#formUserInfo').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 获取表单的内容
        var data = $(this).serialize()
        // 发送 ajax 请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data,
            success(res) {
                if (res.status !== 0) return layer.msg('更新用户信息失败！')

                layer.msg('更新用户信息成功！')

                // 调用父页面中的函数，重新渲染用户的信息
                window.parent.getUserInfo()
            }
        })
    })

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认重置行为
        e.preventDefault()
        // 重新提交表单
        initUserInfo()
    })

})