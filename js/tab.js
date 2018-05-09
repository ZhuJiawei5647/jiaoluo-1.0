var Tab = function (nav,id) {
	this.$nav = $(nav);
	this.tab = $('<ul class="main-tab"></ul>')
	// this.pageBox = $(pel)
	// this.arr = arr;
	// this.nowpage = null;
	// this.nowitem = null;
	// this.event = {};

	this.createItems();
	this.init(id);

	// this.list = {};
}

Tab.data = [
	{
		url: 'index'
		,type: '1'
		,id: '1'
		,title: ''
		,imageurl: '../images/art_csend4.png'
		,activeimageurl: '../images/art_csendclick4.png'
		,text: '首页'
		,title: '首页'
	}
	,{
		url: 'map'
		,type: '1'
		,id: '2'
		,imageurl: '../images/art_csend3.png'
		,activeimageurl: '../images/art_csendclick3.png'
		,text: '地图'
		,title: '地图'
	}
	,{
		url: 'publish'
		,type: '0'
		,id: '3'
		,content: ''
		,imageurl: '../images/zhu_fabu.png'
		,newpage: true
	}
	,{
		url: 'quan'
		,type: '1'
		,id: '4'
		,imageurl: '../images/art_csend1.png'
		,activeimageurl: '../images/art_csendclick1.png'
		,text: '圈子'
		,title: '圈子'
	}
	,{
		url: 'user'
		,type: '1'
		,id: '5'
		,imageurl: '../images/art_csend2.png'
		,activeimageurl: '../images/art_csendclick2.png'
		,text: '用户'
		,title: '用户'
	}
]

Tab.type = {
	type0 : '<div class="tab-type-0"><img src="{{= imageurl}}"></div>'
	,type1 : '<div class="tab-type-1"><div class="row"><img src="{{= active? activeimageurl : imageurl}}"></div><div class="row"><span style="color: {{= active? \'#008c8c\' : \'#000\'}}">{{= text}}</span></div></div>'
}

Tab.prototype = {
	init : function(id) {
		var item = this.getItem(id)
		$(item).addClass('active')
		console.log($(item).data('data'))
		this.createActivedItem($(item).data('data'), $(item))
		// var id = window.sessionStorage.getItem("activeTabId");
		// if (id) {
		// 	var item = this.getItem(id)
		// 	$(item).click();
		// 	var page = this.getPage(id)
		// 	this.pageReload(page)
		// } else {
		// 	var item = this.getItem(this.arr[0].id)
		// 	$(item).click();
		// }
	}
	,createItems : function() {
		var arr = Tab.data
			,self = this;

		for (var i = 0; i < arr.length; i++) {
			$(function (data) {

				var $li = $('<li class="main-tab-item" data-id="'+ data.id +'">')
				self.createNormalItem(data, $li)
				self.tab.append($li)

			}(arr[i]))
		}

		this.$nav.append(this.tab);
		this.setActived();
	}
	,setActived : function () {
		var self = this
			,arr = Tab.data
		this.tab.find('li').each(function (i, el) {
			$(this).on('click', function () {
				var data = arr[i]
				if ($(this).data('id') == self.id) return;
				$(location).attr('href', data.url)

				// if (self.event.actived) self.event.actived(copydata(data))

				// if ( data.newpage ) {
				// 	$(location).attr('href', data.url)
				// }else {
				// 	if (self.nowitem === this) return;
				// 	if (self.nowitem){
				// 		$(self.nowitem).removeClass('active');
				// 		self.createNormalItem($(self.nowitem).data('data'),$(self.nowitem))
				// 	}
				// 	$(this).addClass('active')
				// 	self.createActivedItem(data, $(this))
				// 	$(this).data('data', data)
				// 	self.setNowitem(this)

				// 	var page = self.getPage(data.id)
				// 	if( self.nowpage ) $(self.nowpage).hide();
				// 	if (page){
				// 		$(page).show();
				// 		self.setNowpage(page)
				// 	}else{
				// 		self.setNowpage( self.createPage(data.id, data.url) )
				// 	}
				// 	window.sessionStorage.setItem("activeTabId",data.id);
				// }
			})
		})
	}
	// ,actived : function (fun) {
	// 	this.event.actived = fun;
	// }
	// ,pageReload : function (page) {
	// 	var $iframe = $(page).find('iframe');
	// 	$iframe.attr('src', $iframe.attr('src'))
	// }
	// ,setNowpage : function(page) {
	// 	this.nowpage = page;
	// }
	// ,setNowitem : function(item) {
	// 	this.nowitem = item;
	// }
	// ,getPage : function(id) {
	// 	var page = null
	// 	this.pageBox.find('.main-page').each(function (index) {
	// 		if( $(this).data('id') == id ){
	// 			page = this
	// 		}
	// 	})

	// 	return page
	// }
	,getItem : function(id) {
		var item = null
			,self = this
			,arr = Tab.data;
		this.tab.find('.main-tab-item').each(function (i, el) {
			if( $(this).data('id') == id ){
				item = this
				$(item).data('data', arr[i])
			}
		})

		return item
	}
	// ,createPage : function(id, url) {
	// 	var $iframe = $('<iframe>').attr('data-id', id)
	// 	var $page = $('<div>').addClass('main-page').data('id', id).append($iframe)
	// 	$iframe.attr('src', url)
	// 	this.pageBox.append($page)
	// 	return $page.get(0)
	// }
	,createNormalItem : function(data, item) {
		data.active = false;
		var html = '<div>' + Tab.type['type' + data.type] + '</div>'
		var $content = $(html).tmpl(data)
		item.html($content.prop('outerHTML'))
	}
	,createActivedItem : function(data, item) {
		data.active = true;
		var html = '<div>' + Tab.type['type' + data.type] + '</div>'
		var $content = $(html).tmpl(data)
		item.html($content.prop('outerHTML'))
	}
}

function copydata(data) {
	var datac = {}
	for (var prop in data) {
		datac[prop] = data[prop]
	}
	return datac;
}