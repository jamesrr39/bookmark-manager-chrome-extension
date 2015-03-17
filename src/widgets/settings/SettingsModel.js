define([
], function() {
	"use strict";

	return Backbone.Model.extend({
		initialize: function(){
			this.on("change", function(){
				this.save();
			}, this);
		},
    defaults: {
			recordClickThroughs: true
    },
		fetch: function(options){
			var self = this;

			options = options || {};
			chrome.storage.local.get("settings", function(result){
				self.set(result.settings, {
					silent: true
				});
				if(options && _.isFunction(options.success)){
					options.success(result);
				}
			});
		},
		save: function(){
			chrome.storage.local.set({"settings": this.toJSON()}, function(){
				$.jGrowl("Saved settings");
			});
		},
  });

});
