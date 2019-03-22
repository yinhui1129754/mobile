;(function(maxWidth) {
    var doc = document,
        win = window,
        docEl = doc.documentElement,
        tid;
    function refreshRem() {
        var width = docEl.clientWidth;
            width=width>maxWidth?maxWidth:width;
        var rem = width/10;
        document.documentElement.style.fontSize=rem+"px";
    }
    //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
    refreshRem();

    win.addEventListener("resize", function() {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener("load",function(){
       setTimeout(refreshRem(),100);
    });
})(1920);