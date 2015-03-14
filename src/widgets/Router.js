define([
	"bookmarks/BookmarksListView",
  "settings/SettingsView"
], function(BookmarksListView, SettingsView) {
	"use strict";

  var $contentContainer = $("#content"),
    contentView;

  return Backbone.Router.extend({
    initialize: function(){
      // this.on("route", function(){
      //   contentView.remove();
      // }, this);
    },
    "routes": {
      "settings": "renderSettings",
      "*actions": "renderBookmarksGrid"
    },
    renderBookmarksGrid: function(){

    },
    renderSettings: function(){
      contentView = new SettingsView({
				el: $contentContainer
			});
      contentView.render();
    }
  })


});
