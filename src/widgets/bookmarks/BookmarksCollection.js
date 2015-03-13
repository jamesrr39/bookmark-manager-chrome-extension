define([
	"bookmarks/BookmarkModel",
	"bookmarks/ImportHelper"
], function(BookmarkModel, ImportHelper) {
	"use strict";

	return Backbone.Collection.extend({
		model: BookmarkModel,
		initialize: function() {
			var self = this;

			this.on("add change remove", function(model){
				self.save();
			});
		},
		fetch: function(options){
			var self = this;
			chrome.storage.local.get("bookmarks", function(result){
				self.add(result.bookmarks, {
					silent: true
				});
				if(options && _.isFunction(options.success)){
					options.success(result);
				}
			});

		},
		save: function(){
			chrome.storage.local.set({"bookmarks": this.toJSON()}, function(){
				console.log("successfully saved");
			});
		},
		importFromBrowser: function(){
			var self = this;
			chrome.bookmarks.getTree(function(bookmarkTree){
				// flatten
				var list = ImportHelper.flatten(bookmarkTree),
					mergedList = ImportHelper.mergeFoldersIntoBookmarks(list.bookmarks, list.folders);


				self.add(mergedList,{
					silent: true
				});
				self.trigger("add");
			})
		}
	});
});
