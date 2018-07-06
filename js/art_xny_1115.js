var XNY = function() {
	$.get('/user/getuserinfo', function(data) {
		if (data.status != 201) {
			var timer = new Date().toLocaleString();
			$.get('/notify/getunread', function(data) {
				console.log(data)
				if (data.data.unreadRemind != 0) $('#mine').append($('<span>').addClass('point'))
				else if (data.data.unreadAno != 0) $('#mine').append($('<span>').addClass('point'))
			})
		}
	});
	return this;
}
XNY.prototype = {
	lazyLoadInit () {
		$.fn.extend({
            "lazyLoadInit": function () {
            	$this = $(this)
            	$this.css('position', 'relative');
                var LazyLoad = function () {
                	this.arr = [];
                	$this.scroll(function(event) {
                		this.arr.forEach(function ($el) {
                			if($el.position().top() + $el.height() < 0) return;
                			if($el.position().top() > $this.height()) return;
                			$el.find('.lazy-img').each(function(index, el) {
                				var src = $(el).data('src')
                				if (src) {
                					$(el).attr('src', src);
                				}
                			});
                		})
                	});
				}
				LazyLoad.prototype.append = function($el) {
					this.arr.push($el)
				};
                return new LazyLoad()
            }
        });
	},
	createToindex: function() {
		return $('<div class="xny-toindex" onclick="util.href(\'index\')"></div>')
	},
	createItem: function(article) {
		return $(XNY.tmpls.itemHtml).tmpl(article)
	},
	createCorner: function(corner) {
		return $(XNY.tmpls.cornerHtml).tmpl(corner)
	},
	createFavor: function(corner) {
		var option = {
			ofself: corner.author.ofSelf,
			favor: corner.likeCorner,
			id: corner.cornerid,
			value: corner.befavor
		}
		return $(XNY.tmpls.favorHtml).tmpl(option)
	},
	createLike: function(article) {
		var option = {
			ofself: article.author.ofSelf,
			favor: article.likeArticle,
			id: article.articleid,
			value: article.favor
		}
		return $(XNY.tmpls.likeHtml).tmpl(option)
	},
	createGuanzhu: function(article) {
		var option = {
			ofself: article.author.ofSelf,
			guanzhu: article.author.likeAuthor,
			id: article.author.userid
		}
		return $(XNY.tmpls.guanzhuHtml).tmpl(option)
	},
	createHide: function(article) {
		var option = {
			ofself: article.author.ofSelf,
			status: article.status,
			id: article.articleid
		}
		return $(XNY.tmpls.hideHtml).tmpl(option)
	},
	createZan: function(comment) {
		var option = {
			zan: comment.user.likeAuthor,
			value: comment.zannumber,
			id: comment.commentid
		}
		return $(XNY.tmpls.zanHtml).tmpl(option)
	},
	createPublish: function function_name(argument) {
		return $(XNY.tmpls.publishHtml);
	},
	createMore: function(selector, option) {
		return new More(selector, option);
	},
	createPage: function(option, fun) {
		return new Page(option, fun);
	},
	createWd: function(option, fun) {
		return new Wd(option, fun);
	},
	createSelector: function (option, fun) {
		var opt = $.extend({
			title: '列表',
			list: [],
			checkedValue: ''
		}, option)

		this.createWd({
			titleexit: false,
			fullHeight: true,
			size: ['250px', '200px'],
			position: 'center',
			content: $(XNY.tmpls.selectorHtml).tmpl(opt).prop('outerHTML')
		}, function (page, wd) {
			var elm = null,
				time = 0,
				posy = 0,
				$selector = $(page).find('.selector')
			$selector.on('click', function (event) {
				event.stopPropagation();
			})
			$selector.on('touchstart', function (event) {
				event.stopPropagation();
				elm = event.target
				posy = event.originalEvent.touches[0].clientY
				// console.log(event.touches[0].clientX)
				time = event.timeStamp
				$(event.target).css({
					backgroundColor: '#f2f2f2'
				})
			})
			$selector.on('touchend', function (event) {
				event.stopPropagation();
				passt = event.timeStamp - time;
				passy = event.originalEvent.changedTouches[0].clientY - posy;
				if (event.target === elm && passt < 500 && passy < 20 && passy > -20 ) {
					wd.close();
					fun($(elm).attr('value'), $(elm).text())
				}
				$(event.target).css({
					background: 'none'
				})
			})
		})	
	},
	createImagepage: function () {
		return $(XNY.tmpls.imagepageHtml).tmpl()
	},
	createBall: function() {
		$.getScript('../js/Inertia.js', function() {
			var html = '<div id="ball" draggable="true"><div class="ball-top"></div><!-- <div class="ball-content-box"><span class="ball-content">返回首页</span></div> --></div>'
			$('body').append(html)
			new Inertia(document.getElementById('ball'))
			$('#ball').on('click', function() {
				//				$(this).addClass('active')
				setTimeout(function() {
					$(location).attr('href', 'index')
				}, 250)
			})
		})
	},
	createCai: function(data, corner, fun) {
		this.createPage({}, function (body) {
			var $parent = $(body).parents('.xny-page');
			$parent.children().remove();
			$parent.append($(XNY.tmpls.caiHtml).tmpl(data))
			$parent.on('click', function (event) {
				if (event.target.type === 'submit') {
					var event = $(event.target).data('event')
					if (event === 'share') {
						$.get('/user/getuserinfo', function(data) {
							var url = encodeURIComponent(location.origin + '/page/cornermap?cornerid=' + corner.id)
								,username = data.data.username
								,userimg = encodeURIComponent(data.data.imageurl)
								,cornername = corner.name
							$(location).attr('href', 'sharexintu?username='+ username +
											'&userimg=' + userimg +
											'&cornername='+ corner.name +
											'&url='+ url)
						})
					}else if (event === 'reply') {
						$(location).attr('href', 'cai2?cornerid=' + corner.id + '&url=' + encodeURIComponent(location.href))
					}else if (event === 'close') {
						$parent.hide();
						$parent.remove();
					}
				}
			})
		})
	},
	alert: function(option, fun) {
		var option = $.extend({
				content: '',
				btntext: '确定',
				size: ['200px']
			}, option),
			html = '<div class="xny-alert-box"><p class="xny-alert-content">' + option.content + '</p><div class="xny-btn-box"><button class="xny-button">' + option.btntext + '</button></div></div>'
		return new Wd({
			hasbg: true,
			bgclose: true,
			bgopcity: 0,
			titleexit: false,
			size: option.size,
			position: 'center',
			content: html
		}, function($page, wd) {
			$page.find('.xny-wd').css({
				'background-coror': 'none'
			});
			$page.find('.xny-alert-box .xny-button').on('click', function() {
				wd.close()
				if(typeof fun == 'function') fun()
			})
		})
	},
	getData: function(ul, fun) {
		var self = this
		// var array = []
		$.get(ul, function(data) {
			if (data.status == 201) {
				if (data.msg != '') {
					$(location).attr('href', '/page/login');
				}
			} else if (data.status == 232) {
				util.alert('暂未加入群组,前往添加', function() {
					$(location).attr('href', '/page/group');
				})
			} else {
				fun(data.data);
			}
		});
	},
	data: {
		config: {
			size: {
				indexSize: 20,
				mapSize: 50,
				articleSize: 5,
				detailCommentSize: 5,
				detailAnsSize: 5,
				authorSize: 5,
				cornermapSize: 5,
				guanzhuSize: 10,
				cornersaveSize: 10,
				articlelistSize: 10
			},
			loadmore: ['加载更多', '已全部加载完']
		}
	}
}

XNY.tmpls = {
	itemHtml: '<div><div class="xny-item"><div class="xny-user-img" onclick="util.href(\'author?authorid={{= author.userid}}\')"><img src="{{= util.userHeadImage(author.userheadimageurl)}}"></div><div class="xny-item-body"><div class="xny-art" onclick="util.href(\'detail?id={{= articleid}}\')"><h3 class="xny-art-title">{{= title}}</h3><p class="xny-art-content">{{= artbegin.replace(/\\$\\*\\$/g,"&nbsp;")}}</p>{{if util.articleImage(imageurl)}}<div class="xny-art-img"><img src="{{= imageurl}}"></div>{{/if}}</div><div class="xny-cor">{{if corner}}<div class="xny-cor-content" onclick="util.href(\'cornermap?cornerid={{= corner.cornerid}}\')"><img src="../images/art_csendclick3.png"><span class="xny-cor-name">{{= corner.name}}</span><span class="xny-cor-address">{{= corner.placeaddress}}</span></div>{{/if}}<div class="xny-msg"><span class="xny-msg-item">{{= util.getFullDate(created)}}</span></div></div></div><ul class="xny-icon-list"><li><div class="xny-icon"><img src="../images/yuedu.png"><span>{{= readtime}}</span></div></li><li><div class="xny-icon"><img src="../images/36x36hongxin.png"><span>{{= favor}}</span></div></li><li><div class="xny-icon" onclick="util.href(\'detail?id={{= articleid}}#comment\')"><img src="../images/pinglun.png"><span>{{= comments}}</span></div></li></ul></div></div>',
	cornerHtml: '<div><div class="xny-cor"><div class="xny-cor-content" onclick="util.href(\'cornermap?cornerid={{= cornerid}}\')"><img src="{{= util.userHeadImage(corner.author.userheadimageurl)}}"><span class="xny-cor-name">{{= corner.name}}</span><span class="xny-cor-address">{{= corner.placeaddress}}</span><span class="xny-msg-item" style="float:right">{{= util.getDate(corner.created)}}</span></div><div class="xny-msg"></div></div></div>',
	favorHtml: '<div>{{if favor}}<div class="xny-icon" data-id="{{= id}}" data-value="{{= value}}" onclick="XNY.unfavor(this)"><img src="../images/zhan.png"><span>{{= value}}</span></div>{{else}}<div class="xny-icon" data-id="{{= id}}" data-value="{{= value}}" onclick="XNY.favor(this)"><img src="../images/unzhan.png"><span>{{= value}}</span></div>{{/if}}</div>',
	likeHtml: '<div>{{if ofself}}<div class="xny-icon"><img src="../images/shoucang.png"><span>{{= value}}</span></div>{{else}}{{if favor}}<div class="xny-icon" data-id="{{= id}}" data-value="{{= value}}" onclick="XNY.unlike(this)"><img src="../images/shoucang.png"><span>{{= value}}</span></div>{{else}}<div class="xny-icon" data-id="{{= id}}" data-value="{{= value}}" onclick="XNY.like(this)"><img src="../images/weishoucang.png"><span>{{= value}}</span></div>{{/if}}{{/if}}</div>',
	guanzhuHtml: '<div>{{if !ofself}}{{if guanzhu}}<div class="xny-icon" data-id="{{= id}}" onclick="XNY.unguanzhu(this)"><img src="../images/yiguanzhu.png"></div>{{else}}<div class="xny-icon" data-id="{{= id}}" onclick="XNY.guanzhu(this)"><img src="../images/guanzhu.png"></div>{{/if}}{{/if}}</div>',
	hideHtml: '<div>{{if ofself}}{{if status==3}}<div class="xny-icon" data-id="{{= id}}" onclick="XNY.unhide(this)"><img src="../images/icon_hide.png"></div>{{else}}<div class="xny-icon" data-id="{{= id}}" onclick="XNY.hide(this)"><img src="../images/icon_dis.png"></div>{{/if}}{{/if}}</div>',
	zanHtml: '<div>{{if zan}}<div class="xny-icon" data-id="{{= id}}" data-value="{{= value}}" onclick="XNY.unzan(this)"><span>{{= value}}</span><img src="../images/dianzanhou.png"></div>{{else}}<div class="xny-icon" data-id="{{= id}}" data-value="{{= value}}" onclick="XNY.zan(this)"><span>{{= value}}</span><img src="../images/dianzan.png"></div>{{/if}}</div>',
	publishHtml: '<div class="xny-publish"><div class="xny-input-box"><pre class="xny-input-wei"><span></span></pre><textarea class="xny-input" placeholder="评论" oninput="XNY.input(this)"></textarea></div><div class="xny-btn-box"><button class="xny-button">发布</button></div></div>',
	imagepageHtml: '<template><div class="xny-page imgcut"><header class="xny-header"><div class="xny-button cancel">取消</div><div class="xny-button confirm">确定</div><h1>截图</h1></header><div class="xny-body"><div class="img" style="width: 100%;"><img src="" style="width: 100%;"></div></div></div></template>',
	caiHtml: '<template><section style="width: 100%; box-sizing: border-box; padding: 0 20px; height: 100%; background-color: #ccc; background: url(../images/bj-gezi.png) left top repeat; background-size: 90%; overflow: hidden;"><button style="position: absolute; top: 0; right: 0; width: 40px; height: 40px; background: url(../images/cancel.png) center center no-repeat; background-size: 30px 30px;" data-event="close"></button><div style="margin: 100px auto; max-width: 260px; padding: 30px 15px; background-color: #fff; border-radius: 5px;"><div style="overflow: hidden;"><h4 style="font-size: 18px; font-family: \'Segoe Print\'; font-style: italic;">Dire friend</h4><p style="padding: 10px 30px; font-size: 17px; font-family: \'PingFang SC Medium\';">{{html status == 200? data.secretdec.replace(\'$*$\', \'</br>\') : msg }}</p><span style="float: right; font-size: 18px;">-{{= status == 200? data.author.username : \'鲁迅\' }}</span></div><div style="margin: 15px 0; position: relative; box-sizing: border-box; border: 2px solid #2da297;"><div style="height: 140px; overflow: hidden;">{{if data.secretimg}}<img src="{{= data.secretimg }}" style="width: 100%;">{{else}}<div style="margin-top: 70px; position: relative;">{{if status === 198}}<img style="position: absolute; top: 0px; left: 0px; width: 60px; transform: translateY(-50%);" src="../images/sad.png"><p style="position: absolute; top: 0px; left: 60px; right: 0px; transform: translateY(-50%);">来晚了，秘密被人拿走了</p>{{else status === 199}}<img style="position: absolute; top: 0px; left: 0px; width: 60px; transform: translateY(-50%);" src="../images/sad.png"><p style="position: absolute; top: 0px; left: 60px; right: 0px; transform: translateY(-50%);">太远了，够不着</p>{{else}}<img style="position: absolute; top: 0px; left: 0px; width: 60px; transform: translateY(-50%);" src="../images/happy.png"><p style="position: absolute; top: 0px; left: 60px; right: 0px; transform: translateY(-50%);">厉害了，发现一个秘密</p>{{/if}}</div>{{/if}}</div><div style="position: absolute; top:-10px; left: -2px; width: 87px; height: 46px; background: url(../images/ltsanjiao.png) 0 0 no-repeat; background-size: 100% 100%;"></div></div> <ul style="overflow: hidden; width: 80%; margin: auto;"><li style="float: left; width: 50%;"><button style="display: block; margin: 0 auto; width: 60px; line-height: 30px; font-size: 18px; color: #fff; background-color: #d76e53; border-radius: 4px;" data-event="share">分享</button></li><li style="float: left; width: 50%;"><button style="display: block; margin: 0 auto; width: 60px; line-height: 30px; font-size: 18px; color: #fff; background-color: #d76e53; border-radius: 4px;" data-event="reply">回应</button></li></ul></div></section></template>',
	selectorHtml: '<template><div class="selector"><h4 class="selector-title">{{= title }}</h4><ul class="selector-list">{{each(index, item) list }}<li class="selector-item {{= checkedValue === item.value ?\'checked\': \'\'}}" value="{{= item.value }}">{{= item.text}}</li>{{/each}}</ul></div></template>'
}

XNY.favor = function(el) {
	el.onclick = "";
	var id = $(el).data('id'),
		value = $(el).data('value');
	Loc.getCenter(function(point) {
		$.get('/action/conner/zhan?lat=' + point.lat + '&lng=' + point.lng + '&cornerid=' + id + '&favor=1', function(data) {

			if (data.status == 200) {
				value++;
				var option = {
					id: id,
					value: value,
					favor: true,
					ofself: false
				}
				$(el).parent().html($(XNY.tmpls.favorHtml).tmpl(option))
			} else {
				xny.alert({
					content: data.msg
				})
				el.addEventListener('click', function() {
					XNY.favor(el)
				})
			}

		})
	})
}
XNY.unfavor = function(el) {
	/*el.onclick = "";
	var id = $(el).data('id')
		,value = $(el).data('value');
	// $.get('', function () {
		value--;
		var option = {
			id: id
			,value: value
			,favor: false
			,ofself: false
		}
		$(el).parent().html($(XNY.tmpls.likeHtml).tmpl(option))*/
	// })
}

XNY.like = function(el) {
	el.onclick = "";
	var id = $(el).data('id'),
		value = $(el).data('value');
	$.get('/action/article/zan?articleid=' + id + '&zan=true', function(data) {
		xny.alert({
			content: data.msg
		})
		value++;
		var option = {
			id: id,
			value: value,
			favor: true,
			ofself: false
		}
		$(el).parent().html($(XNY.tmpls.likeHtml).tmpl(option))
	})
}

XNY.unlike = function(el) {
	/*el.onclick = "";
	var id = $(el).data('id')
		,value = $(el).data('value');
	// $.get('', function () {
		value--;
		var option = {
			id: id
			,value: value
			,favor: false
			,ofself: false
		}
		$(el).parent().html($(XNY.tmpls.likeHtml).tmpl(option))*/
	// })
}

XNY.guanzhu = function(el) {
	el.onclick = "";
	var id = $(el).data('id')
	$.get('/action/author/like?authorid=' + id + '&zan=true', function() {
		var option = {
			id: id,
			guanzhu: true,
			ofself: false
		}
		$(el).parent().html($(XNY.tmpls.guanzhuHtml).tmpl(option))
	})
}

XNY.unguanzhu = function(el) {
	el.onclick = "";
	var id = $(el).data('id')
	$.get('/action/author/like?authorid=' + id + '&zan=false', function() {
		var option = {
			id: id,
			guanzhu: false,
			ofself: false
		}
		$(el).parent().html($(XNY.tmpls.guanzhuHtml).tmpl(option))
	})
}

XNY.hide = function(el) {
	el.onclick = "";
	var id = $(el).data('id')
	$.get('/article/inter/hide?articleid=' + id, function() {
		var option = {
			id: id,
			status: 3,
			ofself: true
		}
		$(el).parent().html($(XNY.tmpls.hideHtml).tmpl(option))
	})
}

XNY.unhide = function(el) {
	el.onclick = "";
	var id = $(el).data('id')
	$.get('/article/inter/redistribute?articleid=' + id, function() {
		var option = {
			id: id,
			status: 2,
			ofself: true
		}
		$(el).parent().html($(XNY.tmpls.hideHtml).tmpl(option))
	})
}

XNY.zan = function(el) {
	el.onclick = "";
	var id = $(el).data('id'),
		value = $(el).data('value');
	$.get('/action/comment/zan?commentid=' + id, function() {
		value++;
		var option = {
			id: id,
			value: value,
			zan: true
		}
		$(el).parent().html($(XNY.tmpls.zanHtml).tmpl(option))
	})
}

XNY.unzan = function(el) {
	/*	el.onclick = "";
		var id = $(el).data('id')
			,value = $(el).data('value');
		// $.get('', function () {
			value --;
			var option = {
				id: id
				,value: value
				,zan: false
			}
			$(el).parent().html($(XNY.tmpls.zanHtml).tmpl(option))
		// })
	*/
}

XNY.input = function(self) {
	$(self).siblings('.xny-input-wei').find('span').text($(self).val())
}

XNY.createCaiHtml = function() {}

/* page */

var Page = function(option, fun) {
	this.option = $.extend({
		type: 1,
		title: '标题'
	}, option)
	this.fun = fun;
	this.html = '<div><section class="xny-page"><header class="xny-header" style="background-color: #ccc;"><div class="xny-close"></div><h1>{{= title}}</h1></header><div class="xny-body"></div></section></div>'
	this.$page = null;
	this.init();
}

Page.prototype.init = function() {
	var self = this;
	self.$page = $(self.html).tmpl(self.option)
	$('body').append(self.$page)
	self.$page.find('.xny-close').on('click', function() {
		self.close();
	})
	self.fun(self.$page.find('.xny-body').get(0), self)
}

Page.prototype.close = function() {
	this.$page.remove();
	this.$page = null;
}


/* wd */
var Wd = function(option, fun) {
	this.option = $.extend({
		hasbg: true,
		bgclose: true,
		bgopcity: 0.4,
		titleexit: true,
		fullHeight: false,
		title: '标题',
		size: [],
		position: 'center',
		content: ''
	}, option)
	this.html = '<template><div class="xny-wd-container {{= position}}">{{if hasbg}}<div class="xny-wd-bg" style="opacity: {{= bgopcity}}"></div>{{/if}}<div class="xny-wd-box"><div class="xny-wd"><div class="xny-wd-title" style="display: {{= titleexit ? \'block\' : \'none\'}}">{{= title}}<div class="xny-wd-close"></div></div><div class="xny-wd-body">{{html $(content).prop(\'outerHTML\')}}</div></div></div></div></template>';
	this.$page = null;
	this.init();
	if (typeof fun == 'function'){
		fun.call(this, this.$page, this)
	}
}

Wd.prototype.init = function() {
	var self = this,
		option = self.option;
	self.$page = $(self.html).tmpl(option)

	$('body').append(self.$page)

	self.$page.find('.xny-wd-box').css('width', option.size[0] ? option.size[0] : '250px')
	self.$page.find('.xny-wd-box').css('height', option.size[1] ? option.size[1] : self.$page.find('.xny-wd').height())

	if(option.fullHeight) self.$page.addClass('full-height')

	self.$page.find('.xny-wd-close').on('click', function() {
		self.close()
	})
	if (self.option.bgclose) {
		self.$page.find('.xny-wd-bg').on('click', function(event) {
			event.stopPropagation();
			self.close()
		})
	}
};

Wd.prototype.close = function() {
	this.$page.remove();
	this.$page = null;
}


/* more */
var More = function(selector, option) {
	this.sel = selector;
	this.html = '<div>{{if status==0}}<div class="more">{{= text1}}</div>{{else status==1}}<div class="more">{{= text2}}</div>{{else}}<div class="more">加载中<img src="../images/load.png"></div>{{/if}}</div>'
	this.option = $.extend({
		url: '',
		where: {},
		page: 1,
		size: 10,
		status: 2,
		text1: '加载更多',
		text2: '-.-',
		done: function(data) {
			console.log(data)
		}
	}, option);
	this.init()
}

More.prototype.init = function() {
	console.log('init')
	this.create();
	this.getmore();
}

More.prototype.create = function() {
	console.log('create')
	var self = this,
		option = this.option
	$(this.sel).html('')
	$(this.sel).append($(this.html).tmpl(this.option).on('click', function() {
		$(this).unbind('click');
		if (option.status == 0 || option.status == 2) {
			self.getmore()
		} else {
			console.log('已全部加载完')
		}
	}))
}

More.prototype.getmore = function(fun) {
	console.log('getmore')
	var option = this.option,
		self = this,
		data = $.extend(option.where, {
			page: option.page,
			size: option.size
		})
	option.status = 2;
	$(this.sel).append($(this.html).tmpl(this.option))
	$.ajax({
		url: option.url,
		type: 'get',
		data: data,
		success: function(data) {
			console.log(option.url)
			if (fun) fun();
			var list = More.getlist(data, option.list)
			option.page++;
			if (list.length < option.size) option.status = 1;
			else option.status = 0;
			option.done(data)
			self.create();
		}
	})
}

More.prototype.reflash = function(fun) {
	this.option.page = 1;
	this.getmore(fun);
}

More.getlist = function(data, s) {
	var arr = s.split('.')
	console.log(arr)
	var list = data;
	for (var i = 0; i < arr.length; i++) {
		list = list[arr[i]]
	}
	return list;
}