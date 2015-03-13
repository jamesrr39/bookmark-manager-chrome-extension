requirejs.config({
    paths: {
        widgets: 'widgets',
        libs: '/libs',
        'backbone-grid': '/libs/backbone-grid'
    }
});


define([
  "Router",
	"bookmarks/BookmarksCollection"
], function(Router, BookmarksCollection) {
	"use strict";

	window.app = window.app || {};
	window.app.bookmarksCollection = new BookmarksCollection();
	window.app.bookmarksCollection.fetch({
		success: function(){
      var router = new Router();
      Backbone.history.start();
		}
	});


});
