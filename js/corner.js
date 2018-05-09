var Loc = function (el, fun) {
	this.$el = $(el);
	this.fun = fun;
	this.map = null;
	this.marker = null;
	this.pagehtml = '<div><div class="xny-page"><header class="xny-header"><button class="qz-button cancel">取消</button><button class="qz-button confirm">确定</button><h1>位置</h1></header><div class="xny-body"><div id="map"></div><ul class="locallist"></ul></div></div></div>';
	this.listhtml = '<div>{{each(i, pois) surroundingPois}}<li class="{{= i===0? \'active\':\'\'}}" data-placecity="{{= pois.city}}" data-placename="{{= pois.title}}" data-placeaddress="{{= pois.address}}" data-placelongitude="{{= pois.point.lng}}" data-placelatitude="{{= pois.point.lat}}"><p>{{= pois.title}}</p><p>{{= pois.address}}</p></li>{{/each}}</div>';
	this.$page = null;
	this.data = {};
	var self = this;
	this.$el.on('click', function () {
		console.log('click')
		self.init();
	})
}

Loc.prototype.init = function() {
	console.log('init')
	var self = this
		,$page =$(this.pagehtml).tmpl();
	$('body').append($page)
	var	map = new BMap.Map("map")

	self.$page = $page;
	self.map = map;

	Loc.getCenter(function (point) {
		console.log('center')
		map.addEventListener('moveend', function(e) {
			console.log('moveend')
			Loc.getMessage(this.getCenter(), function (rs) {
				console.log('message')
				$page.find('.locallist').html($(self.listhtml).tmpl(rs))

				map.clearOverlays();
				self.marker = new BMap.Marker(rs.surroundingPois[0].point);
				map.addOverlay(self.marker);
				self.data = $page.find('.locallist li.active').data();

				$page.find('.locallist li').on('click', function () {
					console.log('liclick')
					var point = new BMap.Point($(this).data('placelongitude'), $(this).data('placelatitude'))
					self.marker.setPosition(point)
					$page.find('.locallist li.active').removeClass('active')
					$(this).addClass('active')
					console.log($(this).data())
					self.data = $(this).data()
				})
			})
		})
		map.centerAndZoom(new BMap.Point(point.lng, point.lat), 16);
	})

	$page.find('.cancel').on('click', function () {
		$page.remove();
	})

	$page.find('.confirm').on('click', function () {
		/*self.$el.text(self.data.placename)*/
		self.fun(self.data)
		$page.remove();
	})	
};

Loc.getMessage = function(point, fun) {
	console.log('getMessage')
	var mPoint = new BMap.Point(point.lng, point.lat);
	var mOption = {
		poiRadius: 500,
		numPois: 20
	}
	var myGeo = new BMap.Geocoder();
	myGeo.getLocation(mPoint,
		function mCallback(rs) {
			fun(rs)
		}, mOption
	);
}
Loc.getCenter = function (fun) {
	console.log('getCenter')
	var geolocation = new BMap.Geolocation();
	var point = {
		lng: 130.000000,
		lat: 29.827328
	}
	geolocation.getCurrentPosition(function(r) {
		if (this.getStatus() == BMAP_STATUS_SUCCESS) fun(r.point)
		else {
			console.log('getCenter')
			Loc.getCenter(fun)
		}
	});
}
