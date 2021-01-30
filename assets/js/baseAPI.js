// 每次调用 $.get() 或者 $.post() 或者$.ajax() 前
// 会先调用$.ajaxPrefilter() 这个函数，将请求路径进行拼接
$.ajaxPrefilter(function (options) {
    // 发送ajax请求前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complate 回调函数
    options.complete = function (res) {
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空 token
            localStorage.removeItem('token')
            // 2.强制跳转的登录页面
            location.href = '/login.html'
            // console.log(res);
        }
        
    }

})