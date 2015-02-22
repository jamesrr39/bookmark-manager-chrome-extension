define([
	"bookmarks/BookmarksCollection"
], function(BookmarksCollection) {
	"use strict";
	
	var bookmarksCollection = new BookmarksCollection();
	
	$("#content").text(bookmarksCollection.toJSON());
});