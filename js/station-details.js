$(function(){
    var lieche={
        "01":["韦家碾","科学城"],
        "02":["犀浦","龙泉驿"],
        "03":["成都医学院","双流西站"],
        "04":["万盛","西河"],
        "07":["火车北站","九里堤"],
        "10":["太平园","双流机场"]
    };
    var v2 = new Vue({
        el:document.getElementById("page2"),
        data:function(){
            return {
                nowSelect:0,
                isPhone:false
            }
        },
        mounted:function(){
            var child = $(this.$el).find(".select-box .box");
            var mc = new Hammer(child[0]);
            var THIS = this;
            $(this.$el).css("display","none");
            mc.on("tap", function(ev) {
                ev.srcEvent.stopPropagation();
                utils.showSelect({
                    items:[{name:"我要建议",data:0},{name:"我要投述",data:1},{name:"我要表扬",data:2}],
                    tapCall:function(item,index){
                        child.find(".txt").html(item.name);
                        THIS.nowSelect = item.data;
                        layer.close(index);
                    }
                });
            });
            child.attr("data-val",0);
            child.find(".txt").html("我要建议");
            utils.addEvent($(this.$el).find(".back"),"tap",function(){
                THIS.back();
            });

        },
        methods:{
            back:function(){
                var THIS = this;
                $(this.$el).removeClass("show");
                setTimeout(function(){
                    $(THIS.$el).css("display","none");
                },250);
            }
        }
    });
    var v1 = new Vue({
        el:document.getElementById("page1"),
        mounted:function(){
            var THIS =this;
            var $page = $(THIS.$el);
            var child = $(this.$el).find(".model-4");


            //
            $.ajax({
                type:"get",
                url:"data-cache/all-station.json",
                success:function(data){
                    if(!utils.GetRequest().code){
                        layer.open({
                            content: '请正确的进入该页面'
                            ,btn: '返回信息页',
                            end:function(){
                                location.href="index.html";
                            }
                        });
                        return;
                    }
                    for(var i = 0;i<data.length;i++){
                        if(!data[i].belongCode){data[i].belongCode=[]};
                        for(var q=0;q<data.length;q++){
                            if(data[i].station_name==data[q].station_name){

                                if(data[q].line_code!=data[i].line_code){
                                    if(data[i].belongCode.indexOf(data[q].line_code)==-1){
                                        data[i].belongCode.push(data[q].line_code);
                                    }
                                }

                            }

                        }
                    }
                    THIS.lineData = utils.orderByAttr(data,"line_code");
                    THIS.allData = data;

                    THIS.nowItem = THIS.allData.find(function(item){
                        return item.station_code ==utils.GetRequest().code;
                    });
                    if(!THIS.nowItem){
                        return 0;
                    }
                    THIS.allLine=[THIS.nowItem.line_code].concat(THIS.nowItem.belongCode);
                    if(THIS.nowItem.line_code=="10"){
                        $.ajax({
                            type:"get",
                            url:"data-cache/data/"+THIS.nowItem.station_name+"/"+"换车引导.json",
                            success:function(data){
                                THIS.transferInfo =data;
                                $.ajax({
                                    type:"get",
                                    url:"data-cache/data/"+THIS.nowItem.station_name+"/"+"站外信息.json",
                                    success:function(data){

                                        THIS.stationInfo =data;
                                        THIS.initBool = true;
                                    },
                                    error:function(){
                                        layer.open({
                                            content: '获取数据出错'
                                        });
                                    }
                                });
                            },
                            error:function(){
                                layer.open({
                                    content: '获取数据出错'
                                });
                            }
                        });

                    }else{
                        THIS.initBool = true;
                    }

                },
                error:function(){
                    layer.open({
                        content: '获取数据出错'
                    });
                }
            });

        },
        updated:function(){
            if(this.initBool){
                this.initBool =false;
                var THIS =this;
                var $page = $(THIS.$el);
                var child = $(this.$el).find(".model-4");
                this.swiper1();
                this.swiper2();
                //添加事件
                utils.addEvent(child,"tap",function(ev) {
                    $(v2.$el).css({
                        display:""
                    });
                    setTimeout(function(){
                        $(v2.$el).addClass("show");
                    },0)
                });
                //添加事件
                utils.addEvent($(this.$el).find(".see-info"),"tap",function(ev) {
                    var inter=0;
                    var row ={
                        "列车方向": [{description:lieche[THIS.nowItem.line_code][0]}, {description:lieche[THIS.nowItem.line_code][1]}],
                        "开门方向":[{description:"两侧"}, {description:"往五根松"}],
                        "出站扶梯":[ {description:"2、5车厢"}, {description:"2、5车厢"}],
                        "出站楼梯":[ {description:"3、4车厢"}, {description:"3、4车厢"}],
                        "换乘通道":[ {description:"3车厢"},{description:"3车厢"}],
                        "无障碍梯":[{description:"无"}, {description:"无"}]
                    };
                    if(THIS.nowItem.line_code=="10"){
                        var obj =  utils.orderByAttr(THIS.transferInfo.transferGuide, "entry_label");
                        for(var i in obj){
                            row[i]=obj[i];
                        }
                    }
                    var str = "<div class='layer-user-transfer'>" +
                        "<div class='title'>换乘引导</div>" +
                        "<div class='list'>";
                    for(var w in row){
                        str=str+"<div class='item'><div class='left-1'>"+w+"</div>";
                        if(inter>=1){
                            str=str+"<div class='left-2 c2'>"+row[w][0].description+"</div>";
                            str=str+"<div class='left-3 c2'>"+row[w][1].description+"</div>";
                        }else{
                            str=str+"<div class='left-2'>"+row[w][0].description+"</div>";
                            str=str+"<div class='left-3'>"+row[w][1].description+"</div>";
                        }
                        str=str+"</div>";
                        inter++;
                    }
                    str=str+"<div class='item'><div class='img-1'>"+row["列车方向"][0].description+"</div><div class='img-2'><img class='img' src='../img/10_huaxing_shuangliujichang2hangzhanlou.png'></div></div>";
                    str=str+"<div class='item'><div class='img-1'>"+row["列车方向"][1].description+"</div><div class='img-2'><img class='img' src='../img/10_huaxing_taipingyuan.png'></div></div>";
                    str=str+"</div>" +
                        "<div class='btn'>关闭</div>" +
                        "</div>";
                    var index =layer.open({
                        success:function(e){
                            var mc2 = new Hammer($(e).find(".layui-m-layershade")[0]);
                            mc2.on("tap",function(ev){
                                layer.close(index);
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
                });
            }

        },
        methods:{
            swiper1:function(){
                var THIS = this;
                var $page= $(THIS.$el);
                var swiper = new Swiper($page.find("#swiper1"), {
                    watchSlidesProgress : true,
                    on:{
                        progress: function(progress){
                            THIS.swiperProgress.call(THIS,progress);
                        },
                        slideChange: function(){
                            THIS.swiperProgress.call(swiper.progress);
                        }
                    }
                });
                this.$refs.swiper=swiper;
                this.$refs.swiperBar = {
                    ele:$page.find("#swiper1Bar .bar"),
                    items:$page.find("#swiper1Bar .item")
                };
                this.swiperProgress(0);
                utils.addEvent(this.$refs.swiperBar.items,"tap",function(ev){

                    var index = THIS.$refs.swiperBar.items.indexOf(ev.target);
                    swiper.slideTo(index, 300, false);
                });
            },
            swiperProgress:function(progress){
                if(this.$refs.swiper&&this.$refs.swiperBar){
                    this.changeNav(progress);
                }
            },
            changeNav:function(progeress){
                var nowEle= this.$refs.swiperBar.items[this.$refs.swiper.activeIndex];
                this.$refs.swiperBar.ele.css({
                    width:nowEle.clientWidth+"px",
                    left:$(nowEle).offset().left+"px",
                    transitionDuration: "250ms"
                });
            },

            swiper2:function(){
                var THIS = this;
                var $page= $(THIS.$el);
                var swiper = new Swiper($page.find("#swiper2"), {
                    watchSlidesProgress : true,
                    on:{
                        progress: function(progress){
                            THIS.swiperProgress2.call(THIS,progress);
                        },
                        slideChange: function(){
                            var ele =swiper.slides[THIS.$refs.swiper2.activeIndex];
                            var h =ele.offsetHeight;
                            swiper.$wrapperEl.css({
                                height:h+"px"
                            });
                            THIS.swiperProgress2.call(swiper.progress);
                        }
                    }
                });
                this.$refs.swiper2=swiper;
                this.$refs.swiperBar2 = {
                    ele:$page.find("#swiper2Bar .bar"),
                    items:$page.find("#swiper2Bar .item")
                };
                this.swiperProgress2(0);
                //初始化高度
                var ele =swiper.slides[THIS.$refs.swiper2.activeIndex];
                var h =ele.offsetHeight;
                swiper.$wrapperEl.css({
                    height:h+"px"
                });
                utils.addEvent(this.$refs.swiperBar2.items,"tap",function(ev){

                    var index = THIS.$refs.swiperBar2.items.indexOf(ev.target);
                    swiper.slideTo(index, 300, false);
                });
            },
            swiperProgress2:function(progress){
                if(this.$refs.swiper2&&this.$refs.swiperBar2){
                    this.changeNav2(progress);
                }
            },
            changeNav2:function(progeress){
                var nowEle= this.$refs.swiperBar2.items[this.$refs.swiper2.activeIndex];
                this.$refs.swiperBar2.ele.css({
                    width:nowEle.clientWidth+"px",
                    left:$(nowEle).offset().left+"px",
                    transitionDuration: "250ms"
                });
            }
        },
        data:function(){
            return {
                lineData:{},
                allData:[],
                allLine:[],
                nowItem:{
                    belongCode:[]
                },
                initBool:false,
                transferInfo:{},
                stationInfo:{
                    deviceInfo:[
                        {
                            "gate": "A",
                            "roads": "东御街 人民南路一段 人民中路一段"
                        },
                        {
                            "gate": "B",
                            "roads": "人民东路 人民中路一段 宜盛巷"
                        },
                        {
                            "gate": "C",
                            "roads": "西御街 人民南路一段 东御街"
                        },
                        {
                            "gate": "D",
                            "roads": "东御街 人民南路一段 人民中路一段"
                        }
                    ],
                    busInfo:[
                        {
                            "busStationName": "人民南路一段(公交站)",
                            "busStationDistance": 328.0,
                            "busLine": "16路；26路；45路；61路；63路；78路；118路；334路；G67路；机场专线2号线"
                        },
                        {
                            "busStationName": "红照壁站(公交站)",
                            "busStationDistance": 498.0,
                            "busLine": "1路"
                        }
                    ]
                }
            }
        }
    });
});