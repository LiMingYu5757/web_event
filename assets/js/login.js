$(function () {
    // 点击“去注册账号”事件
    $('#link_reg').on('click', function () {
        $('.login-box').hide().siblings('.reg-box').show()
    })

    // 点击“去登陆”事件
    $('#link_login').on('click', function () {
        $('.login-box').show().siblings('.reg-box').hide()
    })

    // 从 layui 中获取 form 对象
    var form = layui.form
    // 从 layui 中获取 layer 对象
    var layer = layui.layer

    // 调用 form.verify 函数自定义 校验规则
    form.verify({

        // 密码校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 确认密码 校验规则
        repwd: function (value) {
            // 形参 value 调用规则的 表单的值
            // 获取 输入密码 表单的值 
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次输入的密码不一致'
            }
        }
    })

    // 监听 注册表单 提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 获取表单中的数据
        let data = $(this).serialize()
        // 发起Ajax请求
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 注册成功  模拟点击去登陆事件
                $('#link_login').click()
            }
        })
    })

    // 监听 登录表单 提交事件
    $('#form_login').submit(function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起 ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) return layer.msg(res.message)

                layer.msg('登录成功')

                // 把登录成功返回的 token 字符串保存到 localStorage 中
                localStorage.setItem('token', res.token)

                // 跳转到 后台页面
                location.href = '/index.html'
            }
        })
    })
})