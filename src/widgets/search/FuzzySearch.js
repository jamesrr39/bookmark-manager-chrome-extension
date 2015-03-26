define([
], function() {
	"use strict";

  return {
    calculateScore: function(searchTerm, bookmark){
      var searchTermFragments = _.map(searchTerm.split(" "), function(fragment){
        return fragment.toLowerCase();
      }),
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
        var score = 0,
          weights = window.app.settingsModel.toJSON(); // todo separate search model

        score += getSearchTermOcurrencesInHaystack(bookmark.url) * weights.searchTermAppearsInURLOccurence;
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
