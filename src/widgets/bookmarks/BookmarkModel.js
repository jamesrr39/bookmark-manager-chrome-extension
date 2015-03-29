define([], function() {
	"use strict";

	return Backbone.Model.extend({
		idAttribute: "url",
		defaults: {
			clickThroughs: 0,
			folders: []
		}
	});
});
