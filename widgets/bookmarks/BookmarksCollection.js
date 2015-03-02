define([
	"bookmarks/BookmarkModel"
], function(BookmarkModel) {
	"use strict";

	return Backbone.Collection.extend({
		model: BookmarkModel,
		initialize: function() {
			// mock
			this.add([{
					url: "http://example.com",
					title: "example site",
					labels: ["example", "not a real site"]
				}, {
					url: "http://jr39.net",
					title: "jr39",
					labels: ["domain example"]
				}]);
		}
	});
});