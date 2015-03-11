requirejs.config({
    paths: {
        widgets: 'widgets',
        libs: '/libs',
        'backbone-grid': '/libs/backbone-grid'
    }
});


define([
	"bookmarks/BookmarksCollection",
	"bookmarks/BookmarksListView"
], function(BookmarksCollection, BookmarksListView) {
	"use strict";

	window.app = window.app || {};
	window.app.bookmarksCollection = new BookmarksCollection();
	window.app.bookmarksCollection.fetch({
		success: function(){

			var $contentContainer = $("#content"),
			bookmarkListView = new BookmarksListView({
				el: $contentContainer
			});
			bookmarkListView.render();
		}
	});


});
