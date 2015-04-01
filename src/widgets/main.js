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
	"bookmarks/BookmarksListView",
	"settings/SettingsModel"
], function(BookmarksCollection, SettingsView, BookmarksListView, SettingsModel) {
	"use strict";

	var bookmarksFetched = false,
			settingsFetched = false,
			loadUI = function() {
				if (!bookmarksFetched || !settingsFetched) {
					return;
				}

				window.app.bookmarksView = new BookmarksListView({
					el: $("#bookmarksGrid")
				});
				window.app.bookmarksView.render();

				window.app.settingsView = new SettingsView({
					el: $("#settings")
				});
				window.app.settingsView.render();
			};

	window.app = window.app || {};
	window.app.bookmarksCollection = new BookmarksCollection();
	window.app.settingsModel = new SettingsModel();

	window.app.bookmarksCollection.fetch({
		success: function() {
			bookmarksFetched = true;
			loadUI();
		}
	});
	window.app.settingsModel.fetch({
		success: function() {
			settingsFetched = true;
			loadUI();
		}
	});
});
