$(function () {
    // 从 layui 中获取 form和layer 对象
    var form = layui.form
    var layer = layui.layer

    // 自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
  
        samePwd: function (value) {
            let pwd = $('[name=oldPwd]').val()
            if (value === pwd) {
                return '新旧密码不能相同'
            }

        },

        repwd: function (value) {
            let pwd = $('.layui-form [name=newPwd]').val()
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })

    // 监听表单提交事件
    $('.layui-form').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()

        // 发送ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) return layer.msg('更新密码失败！')

                layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset()

            }
        })
    })

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止默认重置行为
        e.preventDefault()
        // 重置表单  原生js reset() 方法
        $('.layui-form')[0].reset()
    })
})