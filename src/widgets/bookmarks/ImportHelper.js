define([
	"bookmarks/BookmarkModel"
], function(BookmarkModel) {
	"use strict";

  return {
    flatten: function(bookmarkSubTree){
      var bookmarks = [],
        folders = [];
      (function flatten(bookmarkSubTree){
        if(Array.isArray(bookmarkSubTree)){
          return bookmarkSubTree.map(function(bookmarkSubTreeChild){
            return flatten(bookmarkSubTreeChild);
          });
        } else if(bookmarkSubTree.hasOwnProperty("children")){
          folders.push(bookmarkSubTree);
          return flatten(bookmarkSubTree.children);
        } else {
          bookmarks.push(bookmarkSubTree);
        }
      })(bookmarkSubTree);
      return {
        bookmarks: bookmarks,
        folders: folders
      };
    },
    mergeFoldersIntoBookmarks: function(bookmarks, folders){
      return _.map(bookmarks, function(bookmark){
        var parentFolder,
          parentFolders = [];
        (function setFolders(node){
          if(node.hasOwnProperty("parentId")){
            // todo - performance, does this need to be moved to a collection
            parentFolder = _.find(folders, function(folder){
              return folder.id === node.parentId;
            });
            if(parentFolder.title !== "" && parentFolder.title !== "Bookmarks bar"){
              parentFolders.push(parentFolder.title);
            }
            setFolders(parentFolder);
          }
        })(bookmark)

        return _.extend(bookmark, {
          folders: parentFolders
        });
      })
    }
  };

});
