var XNY = function(){
	$('#shouye').on('click', function(event) {
		event.preventDefault();
		$(location).attr('href', 'index');
	});
	$('#nearby').on('click', function(event) {
		event.preventDefault();
		$(location).attr('href', 'map');
	});
	$('#article').on('click', function(event) {
		event.preventDefault();
		$(location).attr('href', 'article');
	});
	$('#mine').on('click', function(event) {
		event.preventDefault();
		$(location).attr('href', 'user');
	});
	return this;
}
XNY.prototype = {
	createLi:function () {
		var li = $('<li>')
		li.html('<div class="article-flex">'+
	                '<div class="article-left">'+
	                '<p class="connername">曲院风荷</p>'+
	                '<p class="address">曲院风荷</p>'+
	                '</div>'+
	                '<div class="article-flex icon-box">'+
	                '<div class="icon">'+
	                '<img src="../images/cfoot.png">'+
	                '<span class="pass"> 1</span>'+
	                '</div>'+
	                '<div class="icon">'+
	                '<img src="../images/clikeit.png">'+
	                '<span class="befavor"> 1</span>'+
	                '</div>'+
	                '</div>'+
	                '</div>'+
	                '<div class="article-flex" style="margin-top:5px">'+
	                '<div class="article article-left">'+
	                '<div style="display:flex">'+
	                '<div style="flex:1"><p class="title">角落记事</p></div>'+
	                '<div class="time_dis"></div>'+
	                '</div>'+
	                '<div style="display:flex">'+
	                '<div style="flex:1;width:80%"><p class="content"></p></div>'+
	                '<div class="con-img"></div>'+
	                '</div>'+
	                '</div>'+
	                '</div>');
		return li;
	},
	updateText:function (el,obj) {
	    el.find('.connername').text(obj.connername)
	    el.find('.address').text(obj.address)
	    el.find('.title').text(obj.title)
	    el.find('.content').html(obj.content)
	    el.find('.pass').text(obj.pass)
	    el.find('.befavor').text(obj.befavorNum)
	    el.find('.comments').text(obj.comments)
	    el.find('.time_dis').text(obj.updated)
	    if(obj.imageurl==""||obj.imageurl==null||obj.imageurl=="Null"
	    	||obj.imageurl=="NULL"||obj.imageurl=="null"){}
	    else{
	    	el.find('.con-img').append($('<img>').attr('src', obj.imageurl))
	    }
//	    if (!(obj.userimageurl==""||obj.userimageurl==null||obj.userimageurl=="Null"
//	    	||obj.userimageurl=="NULL")) {
//	    	el.find('.user-img').append($('<img>').attr('src', obj.userimageurl))
//	    };
	},
	getData: function(ul, fun) {
		var self = this
		var array = []
		$.get(ul, function(data) {
			if (data.status == 201) {
				if (data.msg != '') {
					$(location).attr('href', 'login?redirect=article');
				}
			}

			var arr = data.data
			for (var i = 0; i < arr.length; i++) {
				var obj = {}
				obj.lng = arr[i].conner.placelongitude
				obj.lat = arr[i].conner.placelatitude
				obj.articleid = arr[i].articleid
				obj.title = arr[i].title
				obj.content = arr[i].artbegin
				obj.connername = arr[i].conner.name
				obj.address = arr[i].conner.placeaddress
				obj.boring = arr[i].article_boring
				obj.boringNum = arr[i].boring
				obj.favor = arr[i].article_favor
				obj.favorNum = arr[i].favor
				obj.befavor = arr[i].conner_favor
				obj.befavorNum = arr[i].conner.befavor
				obj.pass = arr[i].conner.pass
				obj.comments = arr[i].comments
				obj.distance = arr[i].conner.distance
				obj.connerid = arr[i].conner.id
				obj.imageurl = arr[i].imageurl
				obj.userimageurl = arr[i].userimageurl
				obj.updated = self.changeShortTime(arr[i].updated)
				array.push(obj)
			};
			fun(array);
		});
	},
	getData2:function (ul,fun){
        var arr = []
        for (var i = 0; i < 6; i++) {
        	var obj = {}
            obj.lng = 120.34715259999999 + 0.01 * Math.random()
            obj.lat = 30.279016900000002 + 0.01 * Math.random()
            obj.title = '标题' + i
            obj.content = '大口径风扇考虑考虑更健康十分谨慎考虑房价深刻解放了快速'
            obj.connername = '浙江省政府'
            obj.articleid = 1
            obj.distance = 1
            obj.comments = 2
            obj.pass = 3 
            obj.befavor = false
            obj.befavorNum = 1
            obj.imageurl = '../images/banner_01.jpg'
            obj.userimageurl = '../images/banner_01.jpg'
            obj.connerid = 1
            obj.updated = '6月1日 13:28'
            arr.push(obj)
        };
        fun(arr)
        return arr
    },
    setEvent: function (li,article) {
    	var self = this
        var art = li.find('.article')
        var pass = li.find('.pass').parent('.icon')
        var befavor = li.find('.befavor').parent('.icon')
        art.on('click', function(event) {
            event.preventDefault();
            $(location).attr('href', 'detail?id=' + article.articleid);
        });
        pass.on('click', function(event) {
            event.preventDefault();
            console.log('pass')
            self.Post('/action/conner/pass?placeid='+article.connerid+'&pass='+0, function (data) {
            	 if(data.data=="ok"){
                 	var num = Number(li.find('.pass').text());
                 	var num1 = num+1;
                 	li.find('.pass').text(num1);
                 }else if(data.data=="pass limit"){
                	 alert("今天已踩完，改天再来转转吧")
                 }
            })
        });
        befavor.on('click', function(event) {
            event.preventDefault();
            var favor = 1
            if (!article.befavor) favor = 1;
            else favor = 2
            console.log(favor)
            console.log('befavor')
            self.Post('/action/conner/favor?placeid='+article.connerid+'&favor='+favor, function (data) {
                console.log(data)
                if(data.data=="ok"){
                	var num = Number(li.find('.befavor').text());
                	var num1 = num+1;
                	li.find('.befavor').text(num1);
                }
            })
        });
    },
	Post: function(url, success, faile) {
		$.get(url, function(data) {
			if(data.status==201){
				
			}
			success(data)
			console.log(data)
		});
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