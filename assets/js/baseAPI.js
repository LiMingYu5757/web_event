// 每次调用 $.get() 或者 $.post() 或者$.ajax() 前
// 会先调用$.ajaxPrefilter() 这个函数，将请求路径进行拼接
$.ajaxPrefilter(function(options){
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})