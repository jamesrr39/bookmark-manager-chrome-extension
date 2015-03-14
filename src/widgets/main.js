requirejs.config({
    paths: {
        widgets: 'widgets',
        libs: '/libs',
        'backbone-grid': '/libs/backbone-grid'
    }
});


define([
	"bookmarks/BookmarksCollection",
  "settings/SettingsView",
  "bookmarks/BookmarksListView"
], function(BookmarksCollection, SettingsView, BookmarksListView) {
	"use strict";

	window.app = window.app || {};
	window.app.bookmarksCollection = new BookmarksCollection();
	window.app.bookmarksCollection.fetch({
		success: function(){
      var bookmarksView = new BookmarksListView({
        el: $("#bookmarksGrid")
      });
      bookmarksView.render();

      var settingsView = new SettingsView({
        el: $("#settings")
      });
      settingsView.render();
		}
	});
});
