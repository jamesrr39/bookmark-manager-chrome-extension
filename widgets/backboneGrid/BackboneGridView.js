define([
	"libs/mustache/0.8.1/mustache.min.js",
	"text!backboneGrid/BackboneGridRowTemplate.html",
	"text!backboneGrid/BackboneGridTemplate.html"
], function(Mustache, BackboneGridRowTemplate, BackboneGridTemplate) {
	"use strict";
	return Backbone.View.extend({
		gridTemplate: BackboneGridTemplate,
		rowTemplate: BackboneGridRowTemplate,
		events: {
			"keyup .filter": "filter"
		},
		initialize: function(options) {
			options = options || {};
			this.getHeadings = _.isFunction(options.getHeadings) ? options.getHeadings : this.getHeadings;
			this.getData = _.isFunction(options.getData) ? options.getData : this.getData;
			this.rowTemplate = options.rowTemplate ? options.rowTemplate : this.rowTemplate;
			this.allowDelete = options.allowDelete ? options.allowDelete : this.allowDelete;
			
			this.collection.on("add", function(model) {
				this.addRow(model);
			}, this);
			this.collection.on("remove", function(model) {
				this.removeRow(model.id);
			}, this);
		},
		render: function() {
			var self = this,
					dataHeadings = self.getHeadings(),
					commandHeadings = this.allowDelete ? ["delete"] : [];
			this.$el.html(Mustache.render(this.gridTemplate, {
				headings: dataHeadings.concat(commandHeadings)
			}));
			_.each(this.collection.models, function(dataRecord){
				self.addRow(dataRecord);	
			});
			
		},
		addRow: function(models) {
			var self = this;
			
			if(!_.isArray(models)){
				models = [
					models
				];
			}
			_.each(this.getData(models), function(dataRecord){
				var deleteBtnHtml = "<td><button class='btn btn-default delete'>Delete</button></td>",
					rowHtml = Mustache.render(self.rowTemplate, dataRecord);
				rowHtml = $(rowHtml).append(deleteBtnHtml);
				self.$("tbody").append(rowHtml);
			});
		},
		removeRow: function(id) {
			this.$("tr[data-id='" + id + "']").remove();
		},
		filter: function() {
			var self = this,
					filterTerm = this.$(".filter").val().toLowerCase();
			if (filterTerm === "") {
				$("tr[data-id]").removeClass("hidden");
				return;
			}
			this.collection.each(function(model) {
				var containsURL = model.get("url").toLowerCase().indexOf(filterTerm) > -1,
						containsTitle = model.get("title").toLowerCase().indexOf(filterTerm) > -1;
				if (containsURL || containsTitle) {
					self.$("tr[data-id='" + model.id + "']").removeClass("hidden");
				} else {
					self.$("tr[data-id='" + model.id + "']").addClass("hidden");
				}
			});
		}
	});
});
