define([
	"text!./labelFilterTemplate.html",
	"libs/mustache/mustache.min",
	"./LabelFilterModel"
], function(labelFilterTemplate, Mustache, LabelFilterModel) {
	"use strict";
	
	return Backbone.View.extend({
		events: {
			"click .filterSelector": "toggleSelectFilter",
			"keyup [name='filter']": "filter"
		},
		initialize: function(){
			this.model = new LabelFilterModel();
			this.model.on("change", this.highlightSelected, this);
		},
		render: function(){
			this.$el.html(Mustache.render(labelFilterTemplate, {
				labels: window.app.bookmarksCollection.getAllFolders()
			}));
		},
		highlightSelected: function(){
			var self = this;
			this.$(".filterSelector").removeClass("selected");
			_.each(this.model.get("labels"), function(label){
				self.$(".filterSelector[data-filter-name='" + label + "']").addClass("selected");
			});
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
			var $target = $(event.target),
				filterName = $target.attr("data-filter-name"),
				filterLabels = this.model.get("labels");
			if(_.contains(filterLabels, filterName)){
				filterLabels.splice(filterLabels.indexOf(filterName), 1);
			} else {
				filterLabels.push(filterName);
			}
			this.model.trigger("change");
		}
	});

});
