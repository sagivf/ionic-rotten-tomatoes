angular.module('movies').config(function($stateProvider){
  $stateProvider.state('movies', {
    url: '/movies',
    templateUrl: 'modules/movies/templates/list.html',
    controller: 'moviesCtrl as movies',
    resolve: {
      movies: function(moviesService){
        return moviesService.fetch("a");
      }
    }
  });
});