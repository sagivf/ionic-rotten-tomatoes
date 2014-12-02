angular.module('tomatoes').config(function($urlRouterProvider){
  $urlRouterProvider.otherwise(function($injector){
    var $state = $injector.get('$state');
    $state.go('movies');
  });
});