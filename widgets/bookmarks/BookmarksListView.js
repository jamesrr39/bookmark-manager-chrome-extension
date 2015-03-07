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
						"Labels"
					];
				},
				getData: function(models){
					return _.map(models, function(model){
						return {
							id: model.id,
							url: model.get("url"),
							title: model.get("title"),
							labels: model.get("labels").join(", ")
						};
					});
				}
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
		},
		openTab: function(event){
			var $target = $(event.target);
			chrome.tabs.create({
				url: $target.attr("href")
			});
		}
	});
});