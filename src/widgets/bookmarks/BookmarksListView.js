define([
	"text!bookmarks/bookmarksListTemplate.html",
	"text!bookmarks/bookmarkGridRowTemplate.html",
	"libs/backbone-grid/src/BackboneGridView"
], function(bookmarksListTemplate, bookmarkGridRowTemplate, BackboneGridView) {
	"use strict";

	return Backbone.View.extend({
		events: {
			"click .add-bookmark": "addBookmark",
			"keydown .filter": "filter",
			"click .openTab": "openTab",
			"click [name='showArchived']": "toggleShowArchived"
		},
		initialize: function(){
			var self = this;

			this.bookmarksGrid = new BackboneGridView({
				rowTemplate: bookmarkGridRowTemplate,
				collection: window.app.bookmarksCollection,
				getHeadings: function(){
					return [
						"Page",
						"Click Throughs",
						"" // archive
					];
				},
				getData: function(collection){
					var self = this; // BackboneGridView
					return collection.sortBy(function(model){
							return 1/model.get("clickThroughs");
						})
						.filter(function(model){
							return self.showArchived ? true : (model.get("archived") === false);
						})
						.map(function(model){
							var rowClasses = [],
								url = model.get("url"),
								title = model.get("title");
							if(model.get("archived")){
								rowClasses.push("archived");
							}
							return {
								id: model.id,
								url: url,
								trimmedUrl: (url.length < 80) ? url : url.substring(0, 80) + "...",
								title: title,
								trimmedTitle: (title.length < 160) ? title : title.substring(0, 160) + "...",
								clickThroughs: model.get("clickThroughs"),
								rowClass: rowClasses.join(" "),
								folders: model.get("folders")
							};
						});
				}
			});
		},
		toggleShowArchived: function(event){
			var showArchived = event.target.checked;
			this.bookmarksGrid.showArchived = showArchived;
			this.bookmarksGrid.render();
		},
		render: function(){
			this.$el.html(bookmarksListTemplate);
			this.bookmarksGrid.setElement(this.$(".bookmarksGrid")).render();
			this.$(".bookmarkSelectorContainer .select2-container").click();
		},
		addBookmark: function(){
			chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
				var tab = tabs[0];
				window.app.bookmarksCollection.add({
					url: tab.url,
					title: tab.title
				});
			});
		},
		filter: function(event){
			var $target;
			this.bookmarksGrid.filter
		},
		openTab: function(event){
			var $target = $(event.target),
					url = $target.closest("tr").attr("data-id"),
					model = window.app.bookmarksCollection.get(url);

			model.set("clickThroughs", model.get("clickThroughs") + 1);
			chrome.tabs.create({
				url: $target.attr("href")
			});
		}
	});
});
