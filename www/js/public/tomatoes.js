angular.module('movies', [])
  .provider('urls', function(){

    var apiKey;

    this.setApiKey = function(_apiKey){
      apiKey = _apiKey;
    };

    this.$get = function(){
      if (!apiKey) {
        throw "missing api key";
      }

      return {
        movies: {
          path: 'http://api.rottentomatoes.com/api/public/v1.0/movies.json',
          params: [
            { name: 'query', apiParam: 'q', mandatory: true },
            { name: 'callback', apiParam: 'callback', value: 'JSON_CALLBACK' },
            { name: 'apiKey', apiParam: 'apikey', value: apiKey }
          ]
        },
        movie: {
          path: 'http://api.rottentomatoes.com/api/public/v1.0/movies/:movie.json',
          params: [
            { name: 'callback', apiParam: 'callback', value: 'JSON_CALLBACK' },
            { name: 'apiKey', apiParam: 'apikey', value: apiKey }
          ]
        },
        reviews: {
          path: 'http://api.rottentomatoes.com/api/public/v1.0/movies/:movie/reviews.json',
          params: [
            { name: 'callback', apiParam: 'callback', value: 'JSON_CALLBACK' },
            { name: 'apiKey', apiParam: 'apikey', value: apiKey }
          ]
        }
      }
    }
  });
angular.module('movies').factory('moviesService', ["$http", "urls", "$q", function($http, urls, $q){

  /* possibly an overkill - POC */
  function getMissingParams(paramDefinitions, params){
    var missingParams = [];
    paramDefinitions.forEach(function(param){
      if (param.mandatory && !params[param.name]){
        missingParams.push(param.name);
      }
    });

    return  missingParams;
  }

  /* possibly an overkill - POC */
  function appendDefaultParams(paramDefinitions, res){
    paramDefinitions.forEach(function(param){
      if (param.value){
        res[param.apiParam] = param.value;
      }
    });
  }

  /* possibly an overkill - POC */
  function appendParams(paramDefinitions, res, params){
    Object.keys(params).forEach(function(key){
      var param = paramDefinitions.filter(function(param){
        return param.name === key;
      })[0];

      if (param){
        res[param.apiParam] = params[key];
      }
    });
  }

  /* possibly an overkill - POC */
  function generateParams(name, params){
    var res = {};
    var paramDefinitions = urls[name].params;
    var missingParams = getMissingParams(paramDefinitions, params);
    if (missingParams.length){
      throw {
        message: 'missing mandatory params',
        items: missingParams
      }
    }

    appendDefaultParams(paramDefinitions, res);
    appendParams(paramDefinitions, res, params);

    return res;
  }

  return {
    fetch: function (query) {
      var defer = $q.defer();

      try {
        var params = generateParams('movies', { query: query });

        $http.jsonp(urls.movies.path, { params: params }).then(function (res) {
          defer.resolve(res.data.movies);
        }, defer.reject);
      }
      catch (e) {
        console.error(e);
        defer.reject("Can't fetch movies at this time");
      }

      return defer.promise;
    },
    fetchMovie: function (id) {
      var params = generateParams('movie', {});
      return $http.jsonp(urls.movie.path.replace(':movie', id), { params: params });
    },
    fetchReviews: function(movieId){
      var defer = $q.defer();
      var params = generateParams('reviews', {});

      $http.jsonp(urls.reviews.path.replace(':movie', movieId), { params: params }).then(defer.resolve, defer.reject);

      return defer;
    }
  }
}]);
angular.module('movies').controller('moviesCtrl', ["$q", "$scope", "$location", "$ionicLoading", "moviesService", "$stateParams", function($q, $scope, $location, $ionicLoading, moviesService, $stateParams){
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

}]);
angular.module('movies').controller('movieCtrl', ["movie", "reviews", function(movie, reviews){
  var vm = this;

  vm.details = movie.data;
  reviews.promise.then(function(reviews){
    vm.reviews = reviews.data.reviews;
  });
}]);
angular.module('movies').directive('ionSearch', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      getData: '&source',
      model: '=?',
      search: '=?filter'
    },
    link: function(scope, element, attrs) {
      attrs.minLength = attrs.minLength || 0;
      scope.placeholder = attrs.placeholder || '';
      scope.search = scope.search || {value: ''};

      if (attrs.source) {
        scope.$watch('search.value', function (newValue) {
          if (newValue.length > attrs.minLength) {
            scope.getData({str: newValue}).then(function (results) {
              scope.model = results;
            }, function(){
              scope.model = [];
            });
          } else {
            scope.model = [];
          }
        });
      }

      scope.clearSearch = function() {
        scope.search.value = '';
      };
    },
    template: '<div class="item-input-wrapper">' +
      '<i class="icon ion-android-search"></i>' +
      '<input type="search" debounce="600" placeholder="{{placeholder}}" ng-model="search.value">' +
      '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
      '</div>'
  };
});
angular.module('movies').config(["$stateProvider", function($stateProvider){
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
      movie: ["moviesService", "$stateParams", function(moviesService, $stateParams){
        return moviesService.fetchMovie($stateParams.movie);
      }],
      reviews: ["moviesService", "$stateParams", function(moviesService, $stateParams){
        return moviesService.fetchReviews($stateParams.movie);
      }]
    }
  });
}]);
angular.module('tomatoes', ['ionic', 'debounce', 'movies'])

  .config(["urlsProvider", function(urlsProvider){
    urlsProvider.setApiKey('7ue5rxaj9xn4mhbmsuexug54');
  }])

  .run(["$ionicPlatform", "$rootScope", "$ionicLoading", "$window", function($ionicPlatform, $rootScope, $ionicLoading, $window) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    $rootScope.goBack = function(){
      $window.history.back();
    }

    $rootScope.$on('$stateChangeStart', function() {
      $ionicLoading.show({
        template: '<i class="ion-loading-a"></i>',
        showBackdrop: false
      });
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      $rootScope.stateName = toState.name;
      $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeError', function() {
      $ionicLoading.hide();
    });
  }]);

angular.module('tomatoes').config(["$urlRouterProvider", function($urlRouterProvider){

  $urlRouterProvider.otherwise(function($injector){
    var $state = $injector.get('$state');
    $state.go('movies');
  });
}]);