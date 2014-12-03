angular.module('movies').controller('moviesCtrl', function($q, $scope, $location, $ionicLoading, moviesService, $stateParams){
  var lastSearch, vm = this;

  vm.filter = {
    value: $stateParams.q
  };

  $scope.$watch(angular.bind(this, function () {
    return this.filter.value;
  }), function (newVal) {
    $location.search('q', newVal);
  });

  this.search = function(str){

    if (lastSearch){
      lastSearch.reject("cancel");
    }

    lastSearch = $q.defer();
    $ionicLoading.show({
      template: '<i class="ion-loading-a"></i>',
      showBackdrop: false
    });

    vm.searching = true;
    var movies = moviesService.fetch(str).then(function(res){
      lastSearch.resolve(res);
    });

    movies.finally(function(){
      vm.searching = false;
      $ionicLoading.hide();
    });

    movies.catch(function(){
      vm.error = true;
    });

    return lastSearch.promise;
  };

});