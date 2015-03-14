define([
	"text!settings/settingsTemplate.html",
	"libs/mustache/mustache.min.js"
], function(settingsTemplate, Mustache) {
	"use strict";

	return Backbone.View.extend({
		events: {
			"click .importFromBrowser": "importFromBrowser"
		},
    render: function(){
			var exportData = encodeURIComponent(JSON.stringify(window.app.bookmarksCollection.toJSON()));
      this.$el.html(Mustache.render(settingsTemplate, {
				exportData: exportData
			}));
    },
		importFromBrowser: function(){
			window.app.bookmarksCollection.importFromBrowser();
		}
  });

});
