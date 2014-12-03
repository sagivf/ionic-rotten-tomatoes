angular.module('movies').value('moviesStore',  {
  data: []
});

angular.module('movies').factory('moviesService', function($http, urls, $q){

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
});