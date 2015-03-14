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
      window.app.bookmarksView = new BookmarksListView({
        el: $("#bookmarksGrid")
      });
      window.app.bookmarksView.render();

      window.app.settingsView = new SettingsView({
        el: $("#settings")
      });
      window.app.settingsView.render();
		}
	});
});
