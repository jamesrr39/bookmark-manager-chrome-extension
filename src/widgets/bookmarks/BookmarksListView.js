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
			"click [name='showArchived']": "toggleShowArchived",
			"click .export": "export"
		},
		initialize: function(){
			var self = this;

			window.app.bookmarksCollection.on("add remove change", function(){
				this.setExportHref();
			}, this)

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
							var rowClasses = [];
							if(model.get("archived")){
								rowClasses.push("archived");
							}
							return {
								id: model.id,
								url: model.get("url"),
								title: model.get("title"),
								clickThroughs: model.get("clickThroughs"),
								rowClass: rowClasses.join(" ")
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
			this.setExportHref();
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
		},
		setExportHref: function(){
			var url = "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(window.app.bookmarksCollection.toJSON()));
			this.$(".export").attr("href", url);
		}
	});
});
