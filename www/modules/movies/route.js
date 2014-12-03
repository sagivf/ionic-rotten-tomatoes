angular.module('movies').config(function($stateProvider){
  $stateProvider.state('movies', {
    url: '/movies?q',
    reloadOnSearch: false,
    templateUrl: 'modules/movies/templates/list.html',
    controller: 'moviesCtrl as movies'
  });

  $stateProvider.state('movie', {
    url: '/movies/:movie',
    templateUrl: 'modules/movies/templates/item.html',
    controller: 'movieCtrl as movie',
    resolve: {
      movie: function(moviesService, $stateParams){
        return moviesService.fetchMovie($stateParams.movie);
      },
      reviews: function(moviesService, $stateParams){
        return moviesService.fetchReviews($stateParams.movie);
      }
    }
  });
});