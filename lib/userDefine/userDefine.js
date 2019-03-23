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
                var mask = $(e).find(".layui-m-layershade")[0];
                var mc2 = new Hammer(mask,{domEvents:true});
                mc2.on("tap",function(ev){
                    ev.preventDefault();
                    ev.srcEvent.preventDefault();
                    ev.srcEvent.stopPropagation();
                    layer.close(index);
                });
               /* $(mask).on("click",function(e){
                   e.preventDefault();
                   e.stopPropagation();
                   console.log("asasdsa");
                  // alert("asdasd");
                });*/
                var mc3 = new Hammer($(e).find(".list")[0],{domEvents:true});
                mc3.on("tap",function(ev){
                   var i = ev.target.getAttribute("data-key");
                    options.tapCall&&options.tapCall(options.items[i],index);
                });
                var mc4 = new Hammer($(e).find(".btn")[0],{domEvents:true});
                mc4.on("tap",function(ev){
                    layer.close(index);

                });
                $(e).find(".layui-m-layercont").addClass("layui-m-layercont2");
                var eleArr = [mask,$(e).find(".list")[0],$(e).find(".btn")[0]];
                for(var i = 0;i<eleArr.length;i++){
                    (function(index){
                        eleArr[index].addEventListener("touchend",function(e){
                            e.preventDefault();
                            e.stopPropagation();
                        },false)
                    })(i);
                }
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
                    domEvents:true
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
    getKey:function(arr,attr){
        var o=[];
        for(var i =0;i<arr.length;i++){
            var item = arr[i];
            if(o.indexOf(item[attr])==-1){
                o.push(item[attr]);
            }
        }
        return o;
    },
    orderByAttr:function(arr,attr){
        var o={};
        for(var i =0;i<arr.length;i++){
            var item = arr[i];
            if(!o[item[attr]]){
                o[item[attr]]=[];
            }
            o[item[attr]].push(item);
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
if(!Array.prototype.find){
    Array.prototype.find=function(f){
        for(var i=0;i<this.length;i++){
            if(f(this[i])){
                return this[i];
            }
        }
    }
}