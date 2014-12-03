angular.module('movies').controller('moviesCtrl', function($scope, $rootScope, moviesStore){
  this.moviesStore = moviesStore;

  $rootScope.subHeader = true;

  $scope.$watch(angular.bind(this, function () {
    return this.moviesStore.data;
  }), function (newVal) {
    $rootScope.fullScreen = !newVal.length;
  });
});

angular.module('movies').controller('moviesSearchCtrl', function($q, $scope, $ionicLoading, moviesService, moviesStore){
  var lastSearch;

  this.list = moviesStore;

  $scope.$watch(angular.bind(this, function () {
    return this.filter && this.filter.value;
  }), function (newVal) {
    moviesStore.hasSearch = newVal && newVal.length;
  });

  this.search = function(str){
    if (lastSearch){
      lastSearch.reject("cancel");
    }

    lastSearch = $q.defer();
    moviesStore.searching = true;
    moviesStore.error = false;
    $ionicLoading.show({
      template: '<i class="ion-loading-a"></i>',
      showBackdrop: false
    });

    var movies = moviesService.fetch(str).then(function(res){
      lastSearch.resolve(res);
    });

    movies.finally(function(){
      moviesStore.searching = false;
      $ionicLoading.hide();
    });

    movies.catch(function(){
      moviesStore.error = true;
    });

    return lastSearch.promise;
  };

});