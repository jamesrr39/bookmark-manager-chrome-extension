define([
	"libs/mustache/mustache.min",
	"text!./inlineEditBookmarkTemplate.html"
], function(Mustache, inlineEditBookmarkTemplate) {
	"use strict";
	
	return Backbone.View.extend({
		events: {
			"click .save": "save",
			"click .delete": "deleteBookmark"
		},
		render: function(){
			this.$el.html(Mustache.render(inlineEditBookmarkTemplate, this.model.toJSON()));
			this.labelSelector = this.$(".tags").select2({
				width: "100%",
				// todo performance?
				tags: _.chain(window.app.bookmarksCollection.pluck("folders")).flatten().uniq().map(function(folder){
					return {
						id: folder,
						text: folder
					};
				}).value()
			});
		},
		deleteBookmark: function(event){
			event.preventDefault();
			window.app.bookmarksCollection.remove(this.model);
			this.destroy();
		},
		save: function(){
			var form = this.$("form")[0];
			event.preventDefault();
			window.app.bookmarksCollection.get(this.model).set({
				title: form.title.value,
				folders: _.pluck(this.labelSelector.select2("data"), "id")
			});
			this.destroy();
		},
		destroy: function(){
			this.remove();
			this.unbind();

		}
	});
	
});
