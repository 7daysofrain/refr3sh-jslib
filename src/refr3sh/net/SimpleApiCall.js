/**
 * Created by 7daysofrain on 15/1/15.
 */
define(['jQuery','signals'], function(j,signals)
{


	var SimpleApiCall = function(){

		var succeed = new signals.Signal();
		var failed = new signals.Signal();
		var done = new signals.Signal();

		Object.defineProperty(this,"succeed",{
			get: function(){
				return succeed;
			}
		});
		Object.defineProperty(this,"failed",{
			get: function(){
				return failed;
			}
		});
		Object.defineProperty(this,"done",{
			get: function(){
				return done;
			}
		});
	};
	SimpleApiCall.prototype.call = function(meth,endpoint,params,successCallback,failCallback,doneCallback){
		if(successCallback){
			this.succeed.addOnce(successCallback);
		}
		if(failCallback){
			this.succeed.addOnce(failCallback);
		}
		if(doneCallback){
			this.succeed.addOnce(doneCallback);
		}
		var that = this;
		$.ajax({
			url: endpoint,
			data: params,
			type: meth
		})
			.done(function(data){
				that.succeed.dispatch(data)
			})
			.fail(function(data,error) {
				that.failed.dispatch(data, error);
			})
			.always(function(data,status) {
				that.done.dispatch(data, status);
			});
	};
	SimpleApiCall.prototype.get = function(endpoint,params,successCallback,failCallback,doneCallback){
		this.call("get",endpoint,params,successCallback,failCallback,doneCallback);
	};
	SimpleApiCall.prototype.post = function(endpoint,params,successCallback,failCallback,doneCallback){
		this.call("post",endpoint,params,successCallback,failCallback,doneCallback);
	};
	SimpleApiCall.prototype.put = function(endpoint,params,successCallback,failCallback,doneCallback){
		this.call("put",endpoint,params,successCallback,failCallback,doneCallback);
	};
	SimpleApiCall.prototype.delete = function(endpoint,params,successCallback,failCallback,doneCallback){
		this.call("delete",endpoint,params,successCallback,failCallback,doneCallback);
	};
	return SimpleApiCall;
});
