/**
 * Created by 7daysofrain on 20/5/15.
 */
define([

], function() {
	'use strict'

	return function (){
		var stack = Array.prototype.slice.call(arguments);
		return function(tmp){
			while(stack.length > 0){
				tmp = stack.pop().call(this,tmp);
			}
			return tmp;
		}
	};
});