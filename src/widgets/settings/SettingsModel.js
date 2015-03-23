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
			recordClickThroughs: true,
			searchShowThreshold: 0.5,
			searchTermAppearsInURLOccurence: 1,
			searchTermAppearsInTitleOccurence: 1.5,
			previousClickThroughs: 0.1,
			searchTermInFolder: 0.3
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
