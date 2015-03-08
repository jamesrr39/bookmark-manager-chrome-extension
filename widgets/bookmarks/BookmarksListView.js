define([
	"text!bookmarks/bookmarksListTemplate.html",
	"text!bookmarks/bookmarkGridRowTemplate.html",
	"backboneGrid/BackboneGridView"
], function(bookmarksListTemplate, bookmarkGridRowTemplate, BackboneGridView) {
	"use strict";
	
	return Backbone.View.extend({
		events: {
			"click .add-bookmark": "addBookmark",
			"keydown .filter": "filter",
			"click .openTab": "openTab"
		},
		initialize: function(){
			var self = this;
			
			this.bookmarksGrid = new BackboneGridView({
				rowTemplate: bookmarkGridRowTemplate,
				collection: window.app.bookmarksCollection,
				getHeadings: function(){
					return [
						"Page",
						"Click Throughs"
					];
				},
				getData: function(collection){
					return collection.sortBy(function(model){
								return 1/model.get("clickThroughs");
							})
							.map(function(model){
								return {
									id: model.id,
									url: model.get("url"),
									title: model.get("title"),
									clickThroughs: model.get("clickThroughs")
								};
							});
				}
			});
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