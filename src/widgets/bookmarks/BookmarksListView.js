define([
	"text!bookmarks/bookmarksListTemplate.html",
	"text!bookmarks/bookmarkGridRowTemplate.html",
	"libs/backbone-grid/src/BackboneGridView",
	"search/FuzzySearch",
	"bookmarks/edit/InlineEditBookmarkView",
	"filters/LabelFilterView"
], function(bookmarksListTemplate, bookmarkGridRowTemplate, BackboneGridView, FuzzySearch, InlineEditBookmarkView, LabelFilterView) {
	"use strict";

	return Backbone.View.extend({
		events: {
			"click .add-bookmark": "addBookmark",
			"keyup .search": "search",
			"click .openTab": "openTab"
		},
		initialize: function() {
			var bookmarksListView = this;
			this.labelFilterView = new LabelFilterView();
			this.labelFilterView.model.on("change", function(){
				this.renderGrid();
			}, this);
			this.bookmarksGrid = new BackboneGridView({
				rowTemplate: bookmarkGridRowTemplate,
				collection: window.app.bookmarksCollection,
				calculateSearchScore: function() {
					return 1;
				},
				getHeadings: function() {
					return [];
				},
				getData: function(collection) {
					var backboneGridView = this,
						filterLabels = bookmarksListView.labelFilterView.model.get("labels"),
						labelFilteredModels = collection.filter(function(model){
							var noFilter = (filterLabels.length === 0),
								bookmarkIncludedInFilter = _.intersection(filterLabels, model.get("folders")).length > 0; 
							return noFilter || bookmarkIncludedInFilter;
						})
					return _.chain(labelFilteredModels)
						.map(function(model) {
							var rowClasses = [],
								url = model.get("url"),
								title = model.get("title"),
								trimmedTitle = (title.length < 160) ? title : title.substring(0, 160) + "...";
							return {
								id: model.id,
								url: url,
								trimmedUrl: (url.length < 80) ? url : url.substring(0, 80) + "...",
								title: title,
								trimmedTitle: trimmedTitle,
								clickThroughs: model.get("clickThroughs"),
								rowClass: rowClasses.join(" "),
								folders: model.get("folders"),
								searchScore: backboneGridView.options.calculateSearchScore(model.toJSON())
							};
						})
						.filter(function(bookmark) {
							return (bookmark.searchScore >= window.app.settingsModel.get("searchShowThreshold"));
						}).sortBy(function(bookmark) {
							return 1 / bookmark.searchScore;
						}).value();
				}
			});
		},
		render: function() {
			this.$el.html(bookmarksListTemplate);
			this.labelFilterView.setElement(this.$(".labelFilterContainer")).render();
			this.bookmarksGrid.setElement(this.$(".bookmarksGrid"));
			this.renderGrid();
			this.$(".bookmarkSelectorContainer .select2-container").focus();
		},
		renderGrid: function(){
			this.bookmarksGrid.render();
		},
		addBookmark: function() {
			var self = this;
			chrome.tabs.query({
				active: true,
				lastFocusedWindow: true
			}, function(tabs) {
				var tab = tabs[0],
					existingBookmark = window.app.bookmarksCollection.get(tab.url),
					newBookmarkModel = !_.isUndefined(existingBookmark) ? existingBookmark : new window.app.bookmarksCollection.model({
						url: tab.url,
						title: tab.title
					});
				window.app.bookmarksCollection.add(newBookmarkModel);
				var inlineEditBookmarkView = new InlineEditBookmarkView({
					el: self.$(".inlineEditBookmarkContainer").html("<div>").find("div"),
					model: newBookmarkModel
				});
				inlineEditBookmarkView.render();
			});
		},
		search: function(event) {
			var searchTerm = $(event.target).val(),
				searchAlgorithm = FuzzySearch;

			this.bookmarksGrid.options.calculateSearchScore = function(bookmark) {
				return (searchTerm === "") ? 1 : searchAlgorithm.calculateScore(searchTerm, bookmark);
			};

			this.bookmarksGrid.renderRows();
		},
		openTab: function(event) {
			var $target = $(event.target),
				url = $target.closest("tr").attr("data-id"),
				model = window.app.bookmarksCollection.get(url);

			if (window.app.settingsModel.get("recordClickThroughs") === true) {
				model.set("clickThroughs", model.get("clickThroughs") + 1);
			}
			chrome.tabs.create({
				url: $target.attr("href")
			});
		}
	});
});
