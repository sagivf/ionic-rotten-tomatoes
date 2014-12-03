angular.module('movies').config(function($stateProvider){
  $stateProvider.state('movies', {
    url: '/movies',
    views: {
      'main': {
        templateUrl: 'modules/movies/templates/list.html',
        controller: 'moviesCtrl as movies'
      },
      'sub-header': {
        templateUrl: 'modules/movies/templates/search.html',
        controller: 'moviesSearchCtrl as movies'
      }
    }
  });
});