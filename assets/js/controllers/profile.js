function ProfileCtrl($scope, $routeParams, $timeout, $location, $parse,logInData, localStorageService){
    $scope.facebook = false;
    $scope.twitter = false;
    $scope.instigram = false;
    $scope.bbcID = false;
    if(!$scope.profile){
        $scope.name = localStorageService.get('name');
        $scope.profile = localStorageService.get('profile');
        $scope.confirmation = localStorageService.get('confirmation');
        $scope.networks = $scope.profile.user.profile;
        console.log($scope.profile);
        if(!$scope.name){
            $location.path('/profile');
        }
    }
    $scope.networks = Object.getOwnPropertyNames($scope.networks);
    for(var i = $scope.networks.length; i >= 0; i--){
        if($scope.networks[i] === 'twitter' || $scope.networks[i] === 'facebook' || $scope.networks[i] === 'instigram' || $scope.networks[i] === 'bbcID'){
            var social = $scope.networks[i];
            social = $parse(social);  // Get the model
            social.assign($scope, true);  // Assigns a value to it
            $timeout(function() {
                $scope.$apply();
            });
        }
    }
    //$scope.networkLeft = ['twitter', 'facebook', 'bbcID', 'instigram', 'name'];
}