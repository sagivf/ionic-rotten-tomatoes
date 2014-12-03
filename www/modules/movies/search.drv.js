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
      scope.search = {value: ''};

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