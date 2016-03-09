define([

], function() {
	'use strict'
	return function(fn){
		var called = false;
		return function(){
			if(!called){
				called = true;
				fn.apply(this,arguments);
			}
		}
	}
});