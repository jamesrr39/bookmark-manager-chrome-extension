define([
	"text!./labelFilterTemplate.html",
	"libs/mustache/mustache.min"
], function(labelFilterTemplate, Mustache) {
	"use strict";
	
	return Backbone.View.extend({
		events: {
			"click .filterSelector": "toggleSelectFilter",
			"keyup [name='filter']": "filter"
		},
		options: {
			clickFilterSelector: function(){}
		},
		render: function(){
			this.$el.html(Mustache.render(labelFilterTemplate, {
				labels: window.app.bookmarksCollection.getAllFolders()
			}));
		},
		filter: function(event){
			var filterTerm = event.target.value;
			this.$(".filterSelector").each(function(index, filterSelector){
				var labelName = $(filterSelector).attr("data-filter-name");
				// todo starts with or in label name?
				if(filterTerm !== "" && labelName.indexOf(filterTerm) !== 0){
					$(filterSelector).addClass("hidden");
				} else {
					$(filterSelector).removeClass("hidden");
				}
			});
		},
		toggleSelectFilter: function(event){
			var $target = $(event.target);
			$target.toggleClass("selected");
			this.options.clickFilterSelector(event);
		}
	});

});
