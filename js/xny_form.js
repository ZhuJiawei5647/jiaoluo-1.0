var Form = function () {
	this.data = {};
	this.txarblk = '$*$'
}

Form.prototype.submit = function(a, b, c) {
	$(function (self, a, b, c) {
		var $submit = $(a)
			,$form = $submit.parents('form')
			,$textarea = $form.find('textarea')
			
		if (typeof b !== 'function') {
			var def = b
				,complete = c;
		} else {
			var def = {}
				,complete = b;
		}
		$submit.on('touchend', function (event) {
			console.log(event.target)
			var data = getFormJson($form)
			$textarea.each(function (i, el) {
				var prop = el.name;
				data[prop] = data[prop].replace(/\r/ig,"").replace(/\n/ig, self.txarblk)
			})
			for(var prop in def){
				if(!data[prop] || data[prop] === ''){
					data[prop] = def[prop]
				}
			}
			if(self.require(data)){
				complete(data)	
			}else {
				return false;
			}
		})
	}(this, a, b, c))
};

Form.assignmentall = function (sel, data) {
	console.log(data)
	$(sel).find('[name]').each(function (i, el) {
		var val = data[this.name]
		console.log(val)
		if (!val) return
		if (this.tagName === 'textarea'){
			this.value = ReplaceAll(val, self.txarblk, '/r/n')
		} else if (this.type === 'radio'){
			if (this.value == val) $(this).attr('checked', true)
		} else if (this.type === 'checkbox'){

		} else if (this.tagName === 'select'){
			this.value = val
		} else {
			this.value = val
		}
	})
}

Form.assignment = function (sel, val) {
	var a = document.querySelector(sel)
	if (a.tagName === 'textarea'){

	} else if (a.type === 'radio' || a.type === 'checkbox'){

	} else if (a.tagName === 'select'){

	} else {
		a.value = data[a.name]
	}
}

Form.prototype.require = function(data) {
	return true;
};

function ReplaceAll(str, sptr, sptr1){
    while (str.indexOf(sptr) >= 0){
       str = str.replace(sptr, sptr1);
    }
    return str;
}

function getFormJson($form) {
	var o = {};
	var a = $form.serializeArray();
	$.each(a, function () {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
}