angular.module('tomatoes', ['ionic', 'debounce', 'movies'])

  .config(function(urlsProvider){
    urlsProvider.setApiKey('7ue5rxaj9xn4mhbmsuexug54');
  })

  .run(function($ionicPlatform, $rootScope, $ionicLoading) {
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

  })
