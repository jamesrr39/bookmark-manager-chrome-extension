define([
	"text!bookmarks/bookmarksListTemplate.html",
	"backboneGrid/BackboneGridView"
], function(bookmarksListTemplate, BackboneGridView) {
	"use strict";
	
	return Backbone.View.extend({
		events: {
			"click .add-bookmark": "addBookmark",
			"keydown .filter": "filter"
		},
		initialize: function(){
			var self = this;
			
			this.bookmarksGrid = new BackboneGridView({
				collection: window.app.bookmarksCollection
			});
		},
		render: function(){
			this.$el.html(bookmarksListTemplate);
			this.bookmarkSelector = this.$("[name='bookmark-selector']").select2({
				placeholder: "Search bookmarks",
				allowClear: true,
				data: function(){
					return {
						results: window.app.bookmarksCollection.map(function(bookmarkModel){
							return {
								id: bookmarkModel.get("url"),
								text: bookmarkModel.get("title")
							};
						})
					};
				},
				width: "100%"
			});
			this.bookmarksGrid.setElement(this.$(".bookmarksGrid")).render();
			
			this.$(".bookmarkSelectorContainer .select2-container").click();
		},
		addBookmark: function(){
			chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
				var tab = tabs[0];
				window.app.bookmarksCollection.add({
					url: tab.url,
					title: tab.title,
					labels: [
						"1",
						"2"
					]
				});
			});
		},
		filter: function(event){
			var $target;
			this.bookmarksGrid.filter
		}
	});
});