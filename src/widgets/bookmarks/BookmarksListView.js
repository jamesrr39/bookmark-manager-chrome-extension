define([
	"text!bookmarks/bookmarksListTemplate.html",
	"text!bookmarks/bookmarkGridRowTemplate.html",
	"libs/backbone-grid/src/BackboneGridView",
	"search/FuzzySearch"
], function(bookmarksListTemplate, bookmarkGridRowTemplate, BackboneGridView, FuzzySearch) {
	"use strict";

	return Backbone.View.extend({
		events: {
			"click .add-bookmark": "addBookmark",
			"keyup .search": "search",
			"click .openTab": "openTab",
			"click [name='showArchived']": "toggleShowArchived"
		},
		initialize: function() {
			var self = this;

			this.bookmarksGrid = new BackboneGridView({
				rowTemplate: bookmarkGridRowTemplate,
				collection: window.app.bookmarksCollection,
				calculateSearchScore: function() {
					return 1;
				},
				getHeadings: function() {
					return [
						"Page",
						"Click Throughs",
						"Search Score",
						"" // archive
					];
				},
				getData: function(collection) {
					var self = this; // BackboneGridView
					return _.sortBy(collection
						.map(function(model) {
							var rowClasses = [],
								url = model.get("url"),
								title = model.get("title");
							if (model.get("archived")) {
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
								folders: model.get("folders"),
								searchScore: self.options.calculateSearchScore(model.toJSON())
							};
						})
						.filter(function(bookmark) {
							return (bookmark.searchScore >= window.app.settingsModel.get("searchShowThreshold"));
						}),
						function(bookmark) {
							return 1 / bookmark.searchScore;
						});
				}
			});
		},
		toggleShowArchived: function(event) {
			var showArchived = event.target.checked;
			this.bookmarksGrid.showArchived = showArchived;
			this.bookmarksGrid.render();
		},
		render: function() {
			this.$el.html(bookmarksListTemplate);
			this.bookmarksGrid.setElement(this.$(".bookmarksGrid")).render();
			this.$(".bookmarkSelectorContainer .select2-container").focus();
		},
		addBookmark: function() {
			chrome.tabs.query({
				active: true,
				lastFocusedWindow: true
			}, function(tabs) {
				var tab = tabs[0];
				window.app.bookmarksCollection.add({
					url: tab.url,
					title: tab.title
				});
			});
		},
		search: function(event) {
			var searchTerm = $(event.target).val(),
				searchAlgorithm = FuzzySearch;

			this.bookmarksGrid.options.calculateSearchScore = function(bookmark) {
				return (searchTerm === "") ? 1 : searchAlgorithm.calculateScore(searchTerm, bookmark);
			}

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
