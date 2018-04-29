var add_task=$('.add-task')
var task_list=[];
var data;
var current_index;
var data1={};
var task=[];
var task_data;

init()

add_task.on('submit',function(e){
    e.preventDefault();
    var new_task={},$input;
    $input=$(this).find('input[name=content]');
    new_task.content=$input.val();
    if($input=='')return;
    add(new_task)
})

  function add(new_task) {
    task_list.push(new_task); 
    store.set('task_value',task_list);
    task_list=store.get('task_value')
    render_task();
    return true;
  }

function init(){
    if(task_list.length){
        render_task();
    }
}

function render_task(){
    var item_list=$('.item-list')
    item_list.html('')//把item_list清空重新渲染
    for(var i=0;i<task_list.length;i++){
        var task=render_data(task_list[i],i)
        item_list.append(task)//此处应该放在for里面，因为render_data是一条数据，
        //但是渲染的时候是多条渲染
    }  
    del_task();
    listen_detail()
}

function render_data(data,index){
    if(!data)return;
    var render_tpl=
    '<div class="item" data-index="'+index+'">'+
        '<input type="checkbox">'+
        '<span class="content">'+data.content+'</span>'+
        '<span class="fl">'+
        '<span class="del">删除</span>'+
        '<span class="detail">详情</span>'+
        '</span>'
    '</div>'
    return render_tpl;
}
function del_task(){
    $('.del').on('click',function(){
    var item=$(this).parent().parent().data('index')
    delete task_list[item]
    store.set('task_value',task_list)
    render_task()  
})
}
    $('.detail-mask').on('click',function(){
    $('.item-detail').hide()
    $('.detail-mask').hide()
})  


// 监听打开详情页面
function listen_detail(){
    var index;
    $('.item').on('dblclick',function(){
    index=$(this).data('index');
    show_task_detail(index);
})
    $('.detail').on('click',function(){
    index=$(this).parent().parent().data('index');
    show_task_detail(index);
    })
}
function show_task_detail(index){
    render_task_detail(index)
    $('.item-detail').show()
    $('.detail-mask').show()
}
function update_task(index,data){
    task_list[index]=$.extend({}, task_list[index], data);
    store.set('task_value',task_list)
    render_task()  
}

function render_task_detail(index){
    var item=task_list[index]
    var tpl=
    '<form>'+
     '<input type="text" class="detail-content" value="'+(item.content||'')+'">'+
      ' <textarea name="desc" class="desc">'+(item.desc||'')+
      '</textarea>'+
      '<div class="remind">'+
      '<input name="remind_date" class="datetime" type="date" value="'+(item.remind_data||'')+'">'+
      '<button type="submit">submit</button>'+
      '</div>'+
    '</form>'
    $('.item-detail').html('')
    $('.item-detail').html(tpl)
    var update_form=$('form')
    update_form.on('submit',function(e){
        e.preventDefault();
        var data={}
        data.content=$(this).find('.detail-content').val()
        data.desc=$(this).find('[name=desc]').val()
        data.remind_data=$(this).find('.datetime').val()
        update_task(index,data)
        $('.item-detail').hide()
        $('.detail-mask').hide()
    })
}


