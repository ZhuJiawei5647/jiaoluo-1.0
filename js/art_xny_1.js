var XNY = function(hasBack){
	this.data = {}
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
		$(location).attr('href', 'quan');
	});
	$('#mine').on('click', function(event) {
		event.preventDefault();
		$(location).attr('href', 'user');
	});
	$('#add img').on('click', function(event) {
		event.preventDefault();
		$(location).attr('href', 'publish')
	})
	$.get('/user/getuserinfo', function(data) {
	    if(data.status!=201){
	    	var timer = new Date().toLocaleString();
	        $.get('/notify/getunread', function(data){
	        	console.log(data)
	        	if(data.data.unreadRemind != 0) $('#mine').append($('<span>').addClass('point'))
	        	else if(data.data.unreadAno != 0) $('#mine').append($('<span>').addClass('point'))
	        })
	        
	    }
	});
	if (hasBack) this.backtoindex();
	return this;
}
XNY.prototype = {
	backtoindex:function () {
		$('.toindex').on('click', function(event) {
	        event.preventDefault();
	        $(location).attr('href', 'index');
	    });
	},
	createLi:function (article, isSetEvent) {
		var elLi = $('<li>');
		var div = $('<div>').css('width','100%').append(this.createConner(article.corner, isSetEvent)).append(this.createArticle(article, isSetEvent))
		elLi.append(div);
		return elLi;
	},
	createConner:function (conner, isSetEvent) {
		var elConner = $('<div>').addClass('article-flex').html(
			'<div class="conner" style="width:calc(100% - 80px)">'+
	            '<p class="connername"></p>'+
	           /* '<p class="distance"></p>'+*/
	            '<p class="address"></p>'+
            '</div>'+
            '<div class="article-flex icon-box">'+
	            // '<div class="icon">'+
		           //  '<img src="../images/cfoot.png">'+
		           //  '<span class="pass"> 1</span>'+
	            // '</div>'+
	            '<div class="icon">'+
		            '<span class="distance"> </span>'+
	            '<img src="../images/clikeit.png">'+
		            '<span class="befavor"> 1</span>'+
	            '</div>'+
            '</div>'
		).css({'padding-bottom':'6px', 'border-bottom':'1px solid #ddd'})
		this.updateConner(elConner, conner, isSetEvent)
		return elConner;
	},
	createAuthor:function (article, isSetEvent) {
		var elAuthor = $('<div>').css('display', 'flex').html(
			'<div class="user-img"></div>' +
			'<div style="flex:1;padding-top:6px">' +
				'<div style="position:relative">' +
					'<span class="author"></span>' +
					'<div class="focusing"></div>' +
				'<div>' +
			'</div>'
		)
		this.updateAuthor(elAuthor, article, isSetEvent)
		return elAuthor;
	},
	createArticle:function (article, isSetEvent) {
		var elArticle = $('<div>').css('height', '85px').addClass('article').html(
            '<div style="display:flex">' +
            	'<div class="article-left" style="width:calc(100% - 147.5px)">' +
		            '<div><p class="title">角落记事</p></div>' +
		            '<p class="content"></p>' +
		            '<div class="exmsg"><span class="articletime"></span><span class="readtime"></span><span class="comments"></span></div>' +
		        '</div>' +
            	'<div class="con-img"></div>' +
        	'</div>'
		)
		this.updateArticle(elArticle, article, isSetEvent)
		return elArticle;
	},
	updateArticle:function (el,article, isSetEvent) {
	    el.find('.title').text(article.title)
	    var content = article.artbegin.replace(/\$\*\$/g,"&nbsp;")
	    el.find('.content').html(content)
	    el.find('.comments').html('评论&nbsp;'+article.comments)
	    el.find('.readtime').html('阅读&nbsp;'+article.readtime)
	    el.find('.articletime').html(util.getDate(article.created))
	    if(util.articleImage(article.imageurl)){
	    	el.find('.con-img').append($('<img>').attr('src', article.imageurl))
	    }else{
	    	el.find('.con-img').width(0)
	    	el.find('.article-left').css('width', '100%');
	    }
	   /* if(article.imageurl==""||article.imageurl==null||article.imageurl=="Null"
	    	||article.imageurl=="NULL"||article.imageurl=="null"){
	    	el.find('.con-img').width(0)
	    	el.find('.article-left').css('width', '100%');
	    }
	    else{
	    	el.find('.con-img').append($('<img>').attr('src', article.imageurl))
	    }*/
	    if (!!isSetEvent) this.setArticleEvent(el,article);
	},
	updateConner:function (el,conner, isSetEvent) {
	    el.find('.connername').text(conner.name)
	    el.find('.address').text(conner.placename)
	    if (conner.distance) el.find('.distance').text(conner.distance + 'km')
//	    el.find('.pass').text(conner.pass)
	    el.find('.befavor').text(conner.befavor)
		el.find('.befavor').parent('.icon').find('img').attr('src',conner.likeCorner ? '../images/clike.png' : '../images/clikeit.png');
		if (!!isSetEvent) this.setConnerEvent(el,conner);
	},
	updateAuthor:function (el, article) {
		el.find('.author').html(article.username + (article.ofSelf?'&nbsp;<img src="../images/self.png" style="width:20px;height:20px;vertical-align:middle">' : ''))
		el.find('.user-img').append($('<img>').attr('src', util.userHeadImage(article.userheadimageurl)))
		/*if (!(article.userheadimageurl==""||article.userheadimageurl==null||article.userheadimageurl=="Null"
	    	||article.userheadimageurl=="NULL")) {
	    	el.find('.user-img').append($('<img>').attr('src', article.userheadimageurl))
	    }else{
	    	el.find('.user-img').append($('<img>').attr('src', "http://120.26.47.238/www/image/2017/head/userhead.png"))
	    };*/
		if(article.ofSelf) el.find('.focusing').remove()
		else{
			if (article.likeAuthor) {
				el.find('.focusing').append($('<img>').attr('src', "../images/yiguanzhu.png"))
			}else {
				el.find('.focusing').append($('<img>').attr('src', "../images/guanzhu.png"))
			}
		}
	    this.setAuthorEvent(el, article)
	},
    setArticleEvent: function (el,article) {
    	var self = this
        el.on('click', function(event) {
            event.preventDefault();
            $(location).attr('href', 'detail?id=' + article.articleid);
        });
    },
    setConnerEvent:function (el, conner) {
    	var self = this
    	var connerel = el.find('.conner')
        var pass = el.find('.pass').parent('.icon')
        var befavor = el.find('.befavor').parent('.icon')
        connerel.on('click', function(event) {
        	event.preventDefault();
        	$(location).attr('href', 'connermap?connerid=' + conner.cornerid );
        });
        /*pass.on('click', function(event) {
            event.preventDefault();
            console.log('pass')
            self.Post('/action/conner/pass?placeid='+ conner.id +'&pass='+0, function (data) {
            	 if(data.data=="ok"){
                 	var num = Number(el.find('.pass').text());
                 	var num1 = num+1;
                 	el.find('.pass').text(num1);
                 }else if(data.data=="pass limit"){
                	 alert("今天已踩完，改天再来转转吧")
                 }
            })
        });
        befavor.on('click', function(event) {
            event.preventDefault();
            var favor = 1
            if (!conner.conner_favor) favor = 1;
            else favor = 2
            console.log(favor)
            console.log('befavor')
            self.Post('/action/conner/favor?placeid='+ conner.id+'&favor='+favor, function (data) {
                console.log(data)
                if(data.data=="ok"){
                	var num = Number(el.find('.befavor').text());
                	var num1 = num+1;
                	el.find('.befavor').text(num1);
                	conner.conner_favor = !conner.conner_favor;
                }
            })
        });*/
    },
    setAuthorEvent:function (el, article) {
    	
    	el.find('.user-img').on('click', function(event) {
    		event.preventDefault();
    		console.log('作者')
    		$(location).attr('href', 'author?authorid=' + article.userid + '&username=' + article.username);
    	});
    	el.find('.author').on('click', function(event) {
    		event.preventDefault();
    		console.log('作者')
    		$(location).attr('href', 'author?authorid=' + article.userid + '&username=' + article.username);
    	});
    	if(!article.ofSelf){
    		el.find('.focusing').on('click', function(event) {
        		var self = $(this)
        		event.preventDefault();
        		if (!article.likeAuthor) {
        			console.log('关注')
    				$.get('/action/author/like?authorid=' + article.userid + '&zan=true', function(data) {
    					self.find('img').attr('src', "../images/yiguanzhu.png")
    					article.likeAuthor = true
    					console.log('已关注')
    				});
    			} else {
    				$.get('/action/author/like?authorid=' + article.userid + '&zan=false', function(data) {
    					self.find('img').attr('src', "../images/guanzhu.png")
    					article.likeAuthor = false
    				});
    			};
        	});
    	}
    },
	getData: function(ul, fun) {
		var self = this
		// var array = []
		$.get(ul, function(data) {
			if (data.status == 201) {
				if (data.msg != '') {
					$(location).attr('href', '/page/login');
				}
			}else if(data.status==232){
				util.alert('暂未加入群组,前往添加',function(){
					$(location).attr('href', '/page/group');
				})
			}
			else{
				console.log(data.data)
				fun(data.data);
			}
		});
	},
	getData2:function (ul,fun){
        var arr = []
        for (var i = 0; i < 6; i++) {
			var obj = {
				"articleid": 140,
				"aurthorid": 31,
				"username": "杨冰",
				"userimageurl": "http://wx.qlogo.cn/mmopen/4NqpzGruXyrmADU6uYHelHgC7MbPJwibLJjGBfkcdfTPABuZEj9dAS4BI3PiariaJcO0NKxv8QU9v5V1fWia8FPaYw036IH5m4G2/0",
				"title": "#一句话为浙大120周年庆生#",
				"imageurl": "http://120.26.47.238/www/image/2017/06/20/1497945889622768.png",
				"status": 2,
				"boring": 0,
				"favor": 0,
				"comments": 2,
				"readtime": 4,
				"artbegin": "看来撒娇发神经了世界粮食价格临时拘留所考虑放假哦额",
				"created": 1497945893000,
				"updated": 1497945893000,
				"conner": {
					"id": 119,
					"name": "角落",
					"placename": "联德机械(杭州)有限公司",
					"placeaddress": "杭州经济技术开发区18号大街77号",
					"placelatitude": 30.286449,
					"placelongitude": 120.361314,
					"placecity": "杭州市",
					"conner_favor": false,
					"befavor": 3,
					"pass": 3,
					"created": 1497945893000,
					"updated": 1497945893000,
					"sort": 0,
					"distance": 0.0,
					"userid": null,
					"username": null,
					"userimageurl": null,
					"articles": null
				},
				"content": null,
				"article_favor": false,
				"article_boring": false,
				"user_favor": false,
				"comment_list": null
			}
			arr.push(obj)
        };
        fun(arr)
        return arr
    },
	Post: function(url, success, faile) {
		$.get(url, function(data) {
			if(data.status==201){
				$(location).attr('href', '/page/login');
			}else{
			success(data)
			console.log(data)
		}
		});
	},
	changeShortTime: function(num){
    	var time = new Date(num)
        var minute = time.getMinutes()
        if (minute < 10) {
            minute = '0' + minute
        }
        var newtime = (time.getMonth()+1) + "-" + time.getDate() + "-  " + time.getHours() + ":" + minute
        return newtime
    }
	
}