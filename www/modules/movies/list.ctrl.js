angular.module('movies').controller('moviesCtrl', function($scope, $rootScope, moviesStore){
  this.moviesStore = moviesStore;

  $scope.$watch(angular.bind(this, function () {
    return this.moviesStore.data;
  }), function (newVal) {
    $rootScope.fullScreen = !newVal.length;
  });
});

angular.module('movies').controller('moviesSearchCtrl', function($scope, $ionicLoading, moviesService, moviesStore){
  this.list = moviesStore;

  $scope.$watch(angular.bind(this, function () {
    return this.filter.value;
  }), function (newVal) {
    moviesStore.hasSearch = newVal && newVal.length;
  });

  this.search = function(str){
    moviesStore.searching = true;

    $ionicLoading.show({
      template: '<i class="ion-loading-a"></i>',
      showBackdrop: false
    });

    var movies = moviesService.fetch(str);

    movies.finally(function(){
      moviesStore.searching = false;
      $ionicLoading.hide();
    });

    return movies;
  };

});