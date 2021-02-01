$(function () {

    let layer = layui.layer
    let form = layui.form

    initArtCateList()

    // 获取分类文章列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) return layer.msg('获取文章分类失败！')

                // 导入模板引擎
                var htmlStr = template('tpl-table', res)
                // 渲染页面结构
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null // 记录弹出层的索引
    $('#btnAddCate').on('click', function () {
        // 获取弹出层索引
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，为动态添加的 form-add 表单弹出层绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单提交的默认行为
        e.preventDefault()
        // 向服务器发生新增文章分类请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) return layer.msg('新增文章分类失败！')

                // 更新文章分类列表
                initArtCateList()
                layer.msg('新增文章分类成功！')

                // 根据弹出层索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为动态添加的 文章列表 编辑按钮 绑定点击事件
    var indexEdit = null // 记录弹出层的索引
    $('tbody').on('click', '#btnEdit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        // 向服务器发起请求 获得数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            data: id,
            success(res) {
                if (res.status !== 0) return layer.msg('获取文章分类失败！')

                // 渲染表单
                form.val('form-edit', res.data)
            }
        })

    })


    // 通过代理的形式，为动态添加的 form-edit 表单绑定 submit 事件
    $('body').on('submit','#form-edit',function(e){
        // 阻止表单提交的默认行为
        e.preventDefault() 
        // 向服务器发送修改文章分类请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) return layer.msg('修改文章分类失败！')
                
                // 根据弹出层索引关闭弹出层
                layer.close(indexEdit)
                layer.msg('修改文章分类成功！')
                // 更新文章分类列表
                initArtCateList()   
                
            }
        })
    })

    // 通过代理为动态添加的删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(){
        // 获取所点击的删除按钮的Id
        var id = $(this).attr('data-id')
        // 弹出层的
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            // 向数据库发送请求删除数据
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/' + id,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }

                    layer.msg('删除分类成功！')
                    layer.close(index)
                    // 删除成功 更新展示数据
                    initArtCateList()
                }
            })
            
            
        })
    })

})