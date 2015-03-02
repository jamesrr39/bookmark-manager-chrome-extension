define([
	"libs/mustache/0.8.1/mustache.min.js",
	"text!backboneGrid/BackboneGridRowTemplate.html",
	"text!backboneGrid/BackboneGridTemplate.html"
], function(Mustache, BackboneGridRowTemplate, BackboneGridTemplate) {
	"use strict";

	return Backbone.View.extend({
		events: {
			"keyup .filter": "filter"
		},
		initialize: function() {
			this.collection.on("add", function(model) {
				this.addRow(model);
			}, this);
			this.collection.on("remove", function(model) {
				this.removeRow(model.id);
			}, this);
		},
		render: function() {
			var self = this;
			this.$el.html(Mustache.render(BackboneGridTemplate, {
				headings: [
					"Url",
					"Title",
					"Labels"
				],
				rows: self.collection.map(function(record) {
					return {
						id: record.id,
						data: [
							record.get("url"),
							record.get("title"),
							record.get("labels").join(", ")
						]};
				})
			}));
		},
		addRow: function(model) {
			this.$("tbody").append(Mustache.render(BackboneGridRowTemplate, {
				id: model.id,
				data: [
					model.get("url"),
					model.get("title"),
					model.get("labels").join(", ")
				]}
			));
		},
		removeRow: function(id) {
			this.$("tr[data-id='" + id + "']").remove();
		},
		filter: function(){
			var self = this,
				filterTerm = this.$(".filter").val().toLowerCase();
		
			if(filterTerm === ""){
				$("tr[data-id]").removeClass("hidden");
				return;
			}
			this.collection.each(function(model){
				var containsURL = model.get("url").toLowerCase().indexOf(filterTerm) > -1,
					containsTitle = model.get("title").toLowerCase().indexOf(filterTerm) > -1;
				if(containsURL || containsTitle){
					self.$("tr[data-id='" + model.id + "']").removeClass("hidden");
				} else {
					self.$("tr[data-id='" + model.id + "']").addClass("hidden");
				}
			});
		}
	});
});
