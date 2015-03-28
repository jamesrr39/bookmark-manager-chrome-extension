define([
], function() {
	"use strict";

  return {
    calculateScore: function(searchTerm, bookmark){
			searchTerm = searchTerm.trim();
      var weights = window.app.settingsModel.toJSON(), // todo separate search model
				searchTermFragments = _.map(searchTerm.split(" "), function(fragment){
					return fragment.toLowerCase();
				}),
				getURLScore = function(url){
					var score = 0,
						urlFragments = url.split("//")[1].split(/\.|\//g);

					return _.chain(searchTermFragments)
						.map(function(searchTermFragment){
							return _.chain(urlFragments)
								.map(function(urlFragment){
									var indexOfFragment = urlFragment.indexOf(searchTermFragment);
									return (indexOfFragment === -1) ? 0 : (((urlFragment.length - (indexOfFragment + 1)) / urlFragment.length) * weights.searchTermAppearsInURLOccurence);
								})
								.reduce(function(cumulativeFragmentScore, urlFragmentScore){
									return cumulativeFragmentScore + urlFragmentScore;
								})
								.value();
						})
						.reduce(function(cumulativeScore, searchTermFragmentScore){
							return cumulativeScore + searchTermFragmentScore;
						})
						.value();
				},
	      getSearchTermOcurrencesInHaystack = function(haystack){
	        var occurences = 0,
	          fragment,
	          lowerCaseHaystack = haystack.toLowerCase();

	        for(var index = 0; index < searchTermFragments.length; index++){
	          fragment = searchTermFragments[index];
	          if(fragment !== ""){
	            occurences += lowerCaseHaystack.split(fragment).length -1;
	          }
	        }
	        return occurences;
	      };

      return (function(bookmark){
        var score = 0;

        score += getURLScore(bookmark.url);
        score += getSearchTermOcurrencesInHaystack(bookmark.title) * weights.searchTermAppearsInTitleOccurence;
        score += weights.previousClickThroughs * bookmark.clickThroughs;
        score += _.chain(bookmark.folders)
          .map(function(folder){
            return getSearchTermOcurrencesInHaystack(folder) * weights.searchTermInFolder;
          })
          .reduce(function(cumulativeScore, thisScore){
            return cumulativeScore + thisScore;
          })
          .value() || 0;
        return score;
      })(bookmark);
		}
  };

});
