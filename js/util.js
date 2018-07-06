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
    dateFormat: (function () {
        Date.prototype.Format = function (fmt) { //author: meizz 
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "h+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        return function (time, format) {
            return new Date(time).Format(format)
        }
    })(),
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
        var newtime =  (time.getMonth()+1) + "-" + time.getDate() + "  " + time.getHours() + ":" + minute
        return newtime
    },
    changeShortTime: function(num){
    	var time = new Date(num)
        var minute = time.getMinutes()
        if (minute < 10) {
            minute = '0' + minute
        }
        var newtime = (time.getMonth()+1) + "-" + time.getDate() + " " + time.getHours() + ":" + minute
        return newtime
    },
    getDate: function(num){
    	var time = new Date(num)
        var minute = time.getMinutes()
        if (minute < 10) {
            minute = '0' + minute
        }
        var newtime = (time.getMonth()+1) + "-" + time.getDate()
        return newtime
    },
    getDetaTime: function(num){
    	var now = new Date().getTime();
    	var datetime = parseInt(num);
    	console.log(now)
    	console.log(datetime)
    	var deta = datetime - now;
    	var day = Math.floor(deta/(24*60*60*1000))
    	if(deta%(24*60*60*1000) > 0) day = day + 1;
    	if(day > 0) {
    		return '剩余' + day + '天'
    	}else {
    		return '招聘已截止'
    	}
    },
    getFullDate: function(num){
    	var time = new Date(num)
        var minute = time.getMinutes()
        if (minute < 10) {
            minute = '0' + minute
        }
        var newtime = time.getFullYear() + '/' + (time.getMonth()+1) + "/" + time.getDate()
        return newtime
    },
    userHeadImage:function(img){
		
		if(img==""||img==null||img=="Null"
	    	||img=="NULL"||img=="null"||img=="undefined"){
			return "http://120.26.47.238/www/image/2017/head/userhead.png"
		}
		
		return img
	},
    articleImage:function(img){
        console.log(img)
		if(img==""||img==null||img=="Null"
	    	||img=="NULL"||img=="null"||img=="undefined"){
			return false
		}
		
		return true
    },
    href:function (url) {
        location.href = url;  
    },
    isPC: function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    alert: function (t, fun) {
    	var panel = $('<div>').css({
    		'box-sizing': 'border-box',
    		'moz-box-sizing': 'border-box',
    		'webkit-box-sizing': 'border-box',
    		'width': '100%',
    		'height': '100vh',
    		'position': 'fixed',
    		'top': '0',
    		'left': '0',
    		'background-color': 'rgba(0,0,0,0.5)',
    		'padding': '40% 20% 0',
            'z-index': '10000'
    	})
        var box = $('<div>').css({
            'border-radius': '10px',
            'background-color': 'white',
            'overflow': 'hidden'
        }).addClass('animated bounceIn')
    	var text = $('<p>').css({
    		'margin': '0',
    		'padding': '5px',
    		'line-height': '30px',
    		'text-align': 'center',
            'fontsize': '1.1rem'
    	}).text(t)
        var button = $('<div>').css({
            'line-height': '40px',
            'text-align': 'center',
            'font-size': '1.2rem',
            'background-color': 'green',
            'color': 'white'
        }).text('确定')

        button.on('click',function (event) {
            panel.remove();
            if(typeof fun == 'function'){
                fun()
            }
        })
        panel.append(box)
        box.append(text)
        box.append(button)
        $('body').append(panel)
    },



    jcrop: function (img, r){
        var r = r ? r : 1
        var $img = $(img)
        var height = $img.height();
        var width = $img.width();
        var c = height <= width ? height / 2 * 0.8 : width / 2 * 0.66;
        var jcrop_api = null;
        $img.Jcrop({
            bgFade: true,
            bgOpacity: .2,
            allowSelect: false,
            allowResize: true,
            trackDocument: false,
            touchSupport: true,
            aspectRatio: 1.5,
            // createBorders: [width / 2 - c*1.5, height / 2 - c, width / 2 + c*1.5, height / 2 + c],
            setSelect: [width / 2 - c * r, height / 2 - c, width / 2 + c * r, height / 2 + c]
        }, function() {
            jcrop_api = this;
        });
        return jcrop_api;
    },


    upload: function (base64, fun) {
        $.ajax({
            type: "POST",
            url: "/pic/upload0",
            data: {
                file: base64
            },
            success: function(data) {
                fun(data)
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                $('.progress-box').addClass('hide')
                alert("上传失败，请检查网络后重试");
            }
        });
    },

    imgchange: function (img,fun) {
        if (navigator.userAgent.match(/iphone/i)) {}
        var canvas = document.createElement("canvas");
        var rotateshow;
        EXIF.getData(img, function(){
            EXIF.getAllTags(img);
            Orientation = EXIF.getTag(img,'Orientation');
            console.log(Orientation)
            switch (Orientation){
                case 6:
                    rotateshow = util.rotateImg(img,'left',canvas);
                    break;
                case 8:
                    rotateshow = util.rotateImg(img,'right',canvas);
                    break;
                case 3:
                    util.rotateImg(img,'right',canvas);
                    rotateshow = util.rotateImg(img,'right',canvas);
                    break;
                default:
                    rotateshow = img.src;
            }
            var img2 = new Image();
            img2.onload = function () {
                fun(img)
            }
            img2.src = rotateshow; 
        });
    },

    rotateImg: function (img, direction, canvas) {
        var min_step = 0;
        var max_step = 3;
        //var img = document.getElementById(pid);
        if (img == null) return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        var height = img.height;
        var width = img.width;
        //var step = img.getAttribute('step');
        var step = 2;
        if (step == null) {
            step = min_step;
        }
        if (direction == 'right') {
            step++;
            //旋转到原位置，即超过最大值
            step > max_step && (step = min_step);
        } else {
            step--;
            step < min_step && (step = max_step);
        }
        var degree = step * 90 * Math.PI / 180;
        var ctx = canvas.getContext('2d');
        switch (step) {
            case 0:
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0);
                break;
            case 1:
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(degree);
                ctx.drawImage(img, 0, -height);
                break;
            case 2:
                canvas.width = width;
                canvas.height = height;
                ctx.rotate(degree);
                ctx.drawImage(img, -width, -height);
                break;
            case 3:
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(degree);
                ctx.drawImage(img, -width, 0);
                break;
        }
        return canvas.toDataURL();
    },

    getJcropBase64: function (img,jcrop_api) {
        var cvs = document.createElement('canvas')
            ,ctx = cvs.getContext("2d")
            ,width = jcrop_api.getWidgetSize()[0]
            ,height = jcrop_api.getWidgetSize()[1]
            ,option = jcrop_api.tellSelect()

        cvs.width = width;
        cvs.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        //把选中框里的图片内容存起来
        var imageData = ctx.getImageData(option.x, option.y, option.w, option.h);
        cvs.width = option.w;
        cvs.height = option.h;
        //然后再画上去
        ctx.putImageData(imageData, 0, 0);
        return ctx.canvas.toDataURL();
    },

    previewJcropImage: function (xny, file, r, fun) {
        var reader = new FileReader();
        reader.readAsDataURL(file.files[0])
        file.value = '';
        var lastdate = (new Date()).getTime()

        reader.onload = function(evt) {
            console.log((new Date()).getTime() - lastdate)
            var $page = xny.createImagepage();
            $('body').append($page)
            $('.imgcut .img img').load(function() {
                console.log((new Date()).getTime() - lastdate)
                var img = this
                    ,jcrop_api = util.jcrop(img, r);
                $page.find('.cancel').on('click', function(event) {
                    event.preventDefault();
                    jcrop_api.destroy()
                    $page.remove()
                });
                $page.find('.confirm').on('click', function(event) {
                    event.preventDefault();
                    jcrop_api.destroy()
                    $page.remove()
                    util.imgchange(img, function (img) {
                        var base64 = util.getJcropBase64(img,jcrop_api);
                        // console.log(base64)
                        util.upload(base64, function(data){
                        	if(data.error) {
                        		alert('上传失败')
                        		return;
                        	}
                            fun(data, base64)
                        })
                    })
                    
                });
            });
            $('.imgcut .img img').attr('src',evt.target.result)
        }
    }
}