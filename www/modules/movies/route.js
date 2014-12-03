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

  $stateProvider.state('movie', {
    url: '/movies/:movie',
    views: {
      'main': {
        templateUrl: 'modules/movies/templates/item.html',
        controller: function($scope, movie, reviews){
          $scope.details = movie.data;
          reviews.promise.then(function(reviews){
            $scope.reviews = reviews.data.reviews;
          });
        },
        resolve: {
          movie: function(moviesService, $stateParams){
            return moviesService.fetchMovie($stateParams.movie);
          },
          reviews: function(moviesService, $stateParams){
            return moviesService.fetchReviews($stateParams.movie);
          }
        }
      }
    }
  });
});