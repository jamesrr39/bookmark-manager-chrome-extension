define([
	"bookmarks/BookmarksCollection",
	"bookmarks/BookmarksListView"
], function(BookmarksCollection, BookmarksListView) {
	"use strict";
	
	window.app = window.app || {};
	window.app.bookmarksCollection = new BookmarksCollection();
	
	var $contentContainer = $("#content"),
	bookmarkListView = new BookmarksListView({
		el: $contentContainer
	});
	bookmarkListView.render();
	
});