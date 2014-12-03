angular.module('movies').controller('movieCtrl', function(movie, reviews){
  var vm = this;

  vm.details = movie.data;
  reviews.promise.then(function(reviews){
    vm.reviews = reviews.data.reviews;
  });
});