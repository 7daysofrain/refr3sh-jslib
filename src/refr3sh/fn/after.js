/**
 * Created by 7daysofrain on 20/5/15.
 */
define([

], function() {
	'use strict'

	return function(fn,times){
		var counter = 0;
		return function(){
			if(++counter == times){
				counter = 0;
				return fn.apply(this,arguments);
			}
		}
	};
});