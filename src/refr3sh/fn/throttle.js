define([

], function() {
	'use strict'

	return function(fn,delay){
		var last = 0;
		return function(){
			var t = new Date().getTime();
			if(t - last > delay){
				last = t;
				fn.apply(this,arguments);
			}
		}
	}
});