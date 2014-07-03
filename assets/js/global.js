angular.module('globalModule', ['LocalStorageModule'])
    .controller('GlobalCtrl', [
        '$scope',
        '$location',
        'logInData',
        'localStorageService',
        function($scope, $location, logInData, localStorageService) {
            if(!$scope.profile){
                $scope.name = localStorageService.get('name');
                if(!$scope.name){
                    $location.path('/#');
                }else{
                    $scope.profile = localStorageService.get('profile');
                    $scope.confirmation = localStorageService.get('confirmation');
                    $scope.networks = $scope.profile.user.profile;
                }
            }
            $scope.login = function(credentials){
                localStorageService.clearAll();
                $scope.profile = logInData.query();
                $scope.profile.$promise.then(function (result) {
                    $scope.profile = result;
                    // console.log($scope.profile);
                    $scope.networks = $scope.profile.user.profile;
                    // console.log($scope.profile);
                    $scope.name = $scope.profile.user.profile.name;
                    localStorageService.set('name',$scope.name);
                    localStorageService.set('profile',$scope.profile);
                    $location.path('/profile');
                });
            }
}]);