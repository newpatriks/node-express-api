//angular.module('AppCtrl', ['ngRoute', 'logIn', 'globalModule', 'starter'])
angular.module('AppCtrl', ['ngRoute', 'logIn', 'globalModule'])
    .config(siteRouter);

function siteRouter($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl : 'assets/partials/home.html', 
            // controller : LoginCtrl
        })
         .when('/login', {
            templateUrl : 'assets/partials/login.html', 
            controller : LoginCtrl
        })
        .when('/loginform/:social', {
            templateUrl : 'assets/partials/loginform.html', 
            controller : LoginCtrl
        })
        .when('/profile', {
            templateUrl : 'assets/partials/profile.html', 
            controller : ProfileCtrl
        })
        .when('/lockedin', {
            templateUrl : 'assets/partials/lockedin.html', 
             controller : LockedinCtrl
        })
        .when('/profiles', {
            templateUrl : 'assets/partials/listener.html', 
             controller : LockedinCtrl
        })
        .when('/profiles/:id', {
            templateUrl : 'assets/partials/listener.html', 
             controller : LockedinCtrl
        })
         .otherwise({
            redirectTo : '/'
            // controller : ,
        });
}