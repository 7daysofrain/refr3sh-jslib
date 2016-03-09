/**
 * Created by 7daysofrain on 20/5/15.
 */
define([

], function() {
	'use strict'

	return function(fn,delay){
		var timeout;

		return function(){
			clearTimeout(timeout);
			var args = arguments;
			timeout = setTimeout(function(){
				fn.apply(this,args);
			}.bind(this),delay)
		}
	};
});