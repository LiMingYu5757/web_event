$(function () {

    // 从layui中获取layer对象
    var layer = layui.layer
    var form = layui.form
    // 从layui中回去laypage对象
    var laypage = layui.laypage

    // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDay())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }

    // 定义事件补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义获取文章列表需要的参数
    var q = {
        pagenum: 1,  // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示两条
        cate_id: '', // 文章分类的Id
        state: '',   // 文章的发布状态
    }


    initTable()
    initCate()

    // 获取文章列表数据的函数
    function initTable() {
        // 向服务器发送请求
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 根据获取的数据中的total调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    // 获取所有分类的函数
    function initCate() {
        // 向服务器发送请求，获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) return layer.msg('获取分类数据失败')

                // 调用模板引擎
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                // 渲染到第一个下拉选择框中
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-select').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 获取表单中选项的值，并更新发送请求提交的参数
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选数据，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 layui中的 laypage.render() 方法 渲染分页
        laypage.render({
            elem: 'pageBox',     // 存放分页结构的容器
            count: total,        // 总数据条数
            limit: q.pagesize,   // 每页显示几条数据
            curr: q.pagenum,      // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 10],
            // 分页发生切换时，触发jump回调
            jump: function (obj, first) {
                // console.log(obj.curr)
                // 把最新的页码值，赋值到 查询参数对象 q 中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 查询参数对象 q 中
                q.pagesize = obj.limit
                // 首次加载不执行，手动点击才调用
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过事件委托，给编辑按钮 绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {

        let cate_id = $(this).attr('data-id')
        location.href = '/article/art_pub.html?' + cate_id

    })

    // 通过事件委托，给动态添加的 删除按钮 绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取当前分页删除按钮的个数，用来判断页码值是否要 -1
        var len = $('.btn-delete').length
        // 获取 按钮 对应的文章的Id
        var id = $(this).attr('data-id')

        // 弹出层
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 向服务器发送请求删除文章
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success(res) {
                    if (res.status !== 0) return layer.msg('删除失败！')

                    layer.msg('删除成功！')

                    // 判断当前的分页是否还有数据
                    if (len === 1) {
                        // 如果 len 的值 是1 ，说明删除完毕后分页上就没有任何数据了
                        // 修改 请求参数对象 中的页码值 重新进行渲染
                        // 但是 页码值 的最小值必须等于1
                        // 如果当前页码值就是1 则不需要进行修改
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()

                }
            })
            layer.close(index)
        })
    })

})