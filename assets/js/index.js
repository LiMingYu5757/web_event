$(function () {
    // 进入页面，调用函数获取用户信息
    getUserInfo()


    // 从 layui 中获取 layer 对象
    var layer = layui.layer
    // 退出按钮功能
    $('#btnLoginout').on('click', function () {
        // 提示用户是否要退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' },
            function (index) {
                // 1.清空本地存储中的 token
                localStorage.removeItem('token')
                // 2.跳转到登录页面
                location.href = '/login.html'
                // 3.关闭询问框
                layer.close(index);
            })
    })



})


// 获取用户的基本信息
function getUserInfo() {
    // 发起请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success(res) {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败')
            // 请求成功渲染用户的头像
            renderAvatar(res.data)
        },

        // 不论成功还是失败,最终都会调用 complete 回调函数
        // complete(res) {
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
        //         // 1.强制清空 token
        //         localStorage.removeItem('token')
        //         // 2.强制跳转的登录页面
        //         location.href = '/index.html'
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户的头像
    // 优先渲染图片头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 没设置头像，渲染文字头像
        $('.layui-nav-img').hide()
        // 获取昵称的第一个字符作为文字头像的内容，如果是字母转换成大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}