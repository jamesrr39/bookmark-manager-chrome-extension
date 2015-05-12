define([
	"bookmarks/BookmarkModel",
	"bookmarks/ImportHelper"
], function(BookmarkModel, ImportHelper) {
	"use strict";

	return Backbone.Collection.extend({
		model: BookmarkModel,
		initialize: function() {
			var self = this;

			this.on("add change remove", function(model) {
				self.save();
			});
		},
		fetch: function(options) {
			var self = this;

			options = options || {};
			chrome.storage.local.get("bookmarks", function(result) {
				self.add(result.bookmarks, {
					silent: true
				});
				if (options && _.isFunction(options.success)) {
					options.success(result);
				}
			});

		},
		save: function() {
			chrome.storage.local.set({
				"bookmarks": this.toJSON()
			}, function() {
				$.jGrowl("Saved");
			});
		},
		importFromBrowser: function(options) {
			var self = this,
				startingBookmarksQty = window.app.bookmarksCollection.length;

			options = options || {};
			chrome.bookmarks.getTree(function(bookmarkTree) {
				// flatten
				var list = ImportHelper.flatten(bookmarkTree),
					mergedList = ImportHelper.mergeFoldersIntoBookmarks(list.bookmarks, list.folders),
					importedBookmarksQty;

				self.add(mergedList, {
					silent: true
				});
				importedBookmarksQty = window.app.bookmarksCollection.length - startingBookmarksQty;

				if (options && _.isFunction(options.success)) {
					// todo send number of bookmarks imported, number of clashes, number of labels
					options.success(list.bookmarks, list.folders, importedBookmarksQty);
				}
			});
		},
		getAllFolders: function(){
			return _.chain(window.app.bookmarksCollection.pluck("folders")).flatten().uniq().value();
		}
	});
});
