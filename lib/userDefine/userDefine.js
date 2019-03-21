var utils={
    showSelect:function(options){
        options=options||{items:[],tapCall:function(){}};
        var str = '<div class="layer-select-user"><div class="list">' ;

        for(var i =0;i<options.items.length;i++){
            str=str+'<div class="item" data-key="'+i+'">'+options.items[i].name+'</div>';
        }
        str=str+'</div>' +
            '<div class="btn">取消</div>' +
            '</div>';
        var index =layer.open({
            success:function(e){
                var mc2 = new Hammer($(e).find(".layui-m-layershade")[0]);
                mc2.on("tap",function(ev){
                    layer.close(index);
                    ev.srcEvent.preventDefault();
                    ev.srcEvent.stopPropagation();
                });
                var mc3 = new Hammer($(e).find(".list")[0]);
                mc3.on("tap",function(ev){
                   var i = ev.target.getAttribute("data-key");
                    options.tapCall&&options.tapCall(options.items[i],index);
                    ev.srcEvent.preventDefault();
                    ev.srcEvent.stopPropagation();
                });
                var mc4 = new Hammer($(e).find(".btn")[0]);
                mc4.on("tap",function(ev){
                    layer.close(index);
                    ev.srcEvent.preventDefault();
                    ev.srcEvent.stopPropagation();
                });

            },
            shadeClose:false,
            type: 1
            ,content:str
            ,anim: 'up'
            ,style: 'position:fixed; bottom:0; left:0; width: 100%; border:none;'
        });
    },
    addEvent:function(ele,type,f){
        var eleEx=$(ele);
        for(var i=0;i<eleEx.length;i++){
            (function(index){
                var mc = new Hammer(eleEx[index],{
                    preventDefault:false,
                    domEvents:true,
                    touchAction:"auto"
                });
                mc.set({
                    enable:true
                });
                mc.on(type,function(ev){
                    f(ev,eleEx[index],mc);
                });
            })(i);
        }
    },
    orderByAttr:function(arr,attr){
        var o={};
        for(var i =0;i<arr.length;i++){
            var item = arr[i];
            if(!o[item[attr]]){
                o[item[attr]]=[];
            }
            o[item[attr]].push(arr[i]);
        }
        return o;
    },
    GetRequest:function() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
},
    getAll:function(e){
        var arr=[];
        var ele =e;
        while (ele.parentNode){
            arr.push(ele);
            ele=ele.parentNode;
        }
        return arr;
    }
};