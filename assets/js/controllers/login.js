function LoginCtrl($scope, $routeParams, $location, logInData){
    if($routeParams.social){
        $scope.social = $routeParams.social;
    }
}