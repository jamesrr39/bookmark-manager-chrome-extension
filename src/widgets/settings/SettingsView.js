define([
	"text!settings/settingsTemplate.html",
	"libs/mustache/mustache.min.js"
], function(settingsTemplate, Mustache) {
	"use strict";

	return Backbone.View.extend({
		events: {
			"click .importFromBrowser": "importFromBrowser",
			"click [name='recordClickThroughs']": "toggleRecordClickThroughs"
		},
    render: function(){
			var recordClickThroughs = window.app.settingsModel.get("recordClickThroughs");
			this.$el.html(Mustache.render(settingsTemplate, {
				recordClickThroughsCheckedAttr: recordClickThroughs ? "checked='checked'" : ""
			}));
			this.setExportHref();
			window.app.bookmarksCollection.on("change", this.setExportHref, this);
    },
		setExportHref: function(){
			var exportData = encodeURIComponent(JSON.stringify(window.app.bookmarksCollection.toJSON()));
			this.$(".export").attr("href", "data:text/plain;charset=utf-8," + exportData);
		},
		importFromBrowser: function(){
			window.app.bookmarksCollection.importFromBrowser({
				success: function(browserBookmarksList, foldersList, newBookmarksQty){
					window.app.bookmarksView.render();
					$.jGrowl("Successfully imported your bookmarks.<br />Imported " + newBookmarksQty + " new bookmarks.");
				}
			});
		},
		toggleRecordClickThroughs: function(event){
			window.app.settingsModel.set("recordClickThroughs", event.target.checked);
		}
  });

});
