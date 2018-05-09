var util = {
	GetQueryString:function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
             context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
	},
    clacImgZoomParam:function (maxWidth, maxHeight, width, height) {
        var param = {
            top: 0,
            left: 0,
            width: width,
            height: height
        };
        if (width > maxWidth || height > maxHeight) {
            rateWidth = width / maxWidth;
            rateHeight = height / maxHeight;

            if (rateWidth > rateHeight) {
                param.width = maxWidth;
                param.height = Math.round(height / rateWidth);
            } else {
                param.width = Math.round(width / rateHeight);
                param.height = maxHeight;
            }
        }
        param.left = Math.round((maxWidth - param.width) / 2);
        param.top = Math.round((maxHeight - param.height) / 2);
        return param;
    },
    changeTime: function(num) {
        var time = new Date(num)
        var minute = time.getMinutes()
        if (minute < 10) {
            minute = '0' + minute
        }
        var newtime = time.getFullYear() + "年" + (time.getMonth()+1) + "月" + time.getDate() + "日  " + time.getHours() + ":" + minute
        return newtime
    },
    changeShortTime: function(num){
    	var time = new Date(num)
        var minute = time.getMinutes()
        if (minute < 10) {
            minute = '0' + minute
        }
        var newtime = (time.getMonth()+1) + "月" + time.getDate() + "日  " + time.getHours() + ":" + minute
        return newtime
    }
}