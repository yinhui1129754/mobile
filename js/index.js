$(function(){
    var v1= new Vue({
        el:document.getElementById("index"),
        mounted:function(){
            //添加事件
            var THIS = this;
            var $page= $(THIS.$el);

            utils.addEvent($page.find(".cancel"),"tap",function(){
                THIS.tapCancel.apply(THIS,arguments);
            });
            utils.addEvent($page.find(".icon-close"),"tap",function(){
                THIS.tapIconClose.apply(THIS,arguments);
            });
            utils.addEvent($page.find(".back"),"tap",function(){
                window.location.href="CDMetroScheme://navigateBack";
            });
           //
            $.ajax({
                type:"get",
                url:"data-cache/all-station.json",
                success:function(data){
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
                    THIS.keys =utils.getKey(data,"line_code");
                    THIS.allData = data;
                    THIS.initBool = true;
                },
                error:function(){
                    layer.open({
                        content: '获取数据出错'
                    });
                }
            })
        },
        updated:function(){
            if(this.initBool){
                this.bindTap();
                this.initBool=false;
                this.swiper();


            }
        },
        data:function(){
            return {
                search:"",
                lineData:{},
                allData:[],
                historyData:[],
                showData:[],
                initBool:false,
                keys:[],
                color:{
                    "01":"#270b86",
                    "02":"#f3503f",
                    "03":"#c30164",
                    "04":"#2ea959",
                    "05":"#ab27b1",
                    "06":"#ab6834",
                    "07":"#6eccd8",
                    "08":"#9abd07",
                    "09":"#e2a50f",
                    "10":"#0a46b6"
                }
            };
        },
        methods:{
            searchInfo:function(){
                this.showData.length=0;
                for(var i=0;i<this.allData.length;i++){
                    if(this.allData[i].station_name.search(this.search)!=-1){
                        this.showData.push(this.allData[i]);
                        this.allData[i].allLine=[this.allData[i].line_code].concat(this.allData[i].belongCode);
                    }
                }
            },
            swiper:function(){
                var THIS = this;
                var $page= $(THIS.$el);
                var swiper = new Swiper($page.find("#swiper"), {
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
                    ele:$page.find(".header-bottom .bar"),
                    items:$page.find(".header-bottom .item")
                };
                this.swiperProgress(0);
                utils.addEvent(this.$refs.swiperBar.items,"tap",function(ev){
                    var index = THIS.$refs.swiperBar.items.indexOf(ev.target);
                    swiper.slideTo(index, 300, false);
                });
            },
            searchFocus:function(){
                var THIS = this;
                var $page= $(THIS.$el);
                $page.addClass("active");
            },
            tapCancel:function(){
                var THIS = this;
                var $page= $(THIS.$el);
                $page.removeClass("active");
            },
            tapIconClose:function(){
                this.search="";
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
                    left:nowEle.offsetLeft+"px",
                    transitionDuration: "250ms"
                });
            },
            //绑定敲击事件
            bindTap:function(){
                var THIS = this;
                var $page= $(THIS.$el);
                var allItem = $page.find(".con-item .item");
                utils.addEvent(allItem,"tap",function(ev,ele){
                    location.href="station-details.html?code="+ele.getAttribute("data-code");
                });
                utils.addEvent($page.find(".history-search .list"),"tap",function(){
                    THIS.tapList.apply(THIS,arguments);
                });
            },
            tapList:function(ev){

                var ele = utils.getAll(ev.target);
                $.each(ele,function(){
                    if($(this).hasClass("item")){
                        location.href="station-details.html?code="+this.getAttribute("data-code");
                    };
                })
                console.log(ele);
            }
        },
        watch:{
            search:function(){
                var THIS = this;
                var $page= $(THIS.$el);
                if(this.search){
                    $page.find(".icon-close").addClass("show");
                    this.searchInfo();
                }else{
                    $page.find(".icon-close").removeClass("show");

                }
            }
        }
    });
});