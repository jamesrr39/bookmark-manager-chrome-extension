define([
], function() {

	return Backbone.Collection.extend({
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