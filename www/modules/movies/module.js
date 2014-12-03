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