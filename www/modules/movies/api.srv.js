angular.module('movies').factory('moviesService', function($http, urls, $q){

  /* possibly an overkill - POC */
  function getMissingParams(name, params){
    var missingParams = [];
    urls[name].params.forEach(function(param){
      if (param.mandatory && !params[param.name]){
        missingParams.push(param.name);
      }
    });

    return  missingParams;
  }

  /* possibly an overkill - POC */
  function generateParams(name, params){
    var res = {};
    var missingParams = getMissingParams(name, params);
    if (missingParams.length){
      throw {
        message: 'missing mandatory params',
        items: missingParams
      }
    }

    urls[name].params.forEach(function(param){
      if (param.value){
        res[param.apiParam] = param.value;
      }
    });

    Object.keys(params).forEach(function(key){
      var param = urls[name].params.filter(function(param){
        return param.name === key;
      })[0];

      if (param){
        res[param.apiParam] = params[key];
      }
    });

    return res;
  }

  return {
    fetch: function (query) {
      var defer = $q.defer();

      try {
        var params = generateParams('movies', {
          query: query
        });

        $http.jsonp(urls.movies.path, { params: params }).then(defer.resolve, defer.reject);
      }
      catch (e) {
        console.error(e);
        defer.reject("Can't fetch movies at this time");
      }

      return defer.promise;
    }
  }
});