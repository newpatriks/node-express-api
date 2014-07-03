//function LockedinCtrl($scope, getUsersData, $routeParams, $location, $ionicSwipeCardDelegate, localStorageService){
    function LockedinCtrl($scope, getUsersData, $routeParams, $location, localStorageService){
    //
    //  Get profile from local storage or re-direct
    //
    if(!$scope.profile){
        $scope.name = localStorageService.get('name');
        $scope.profile = localStorageService.get('profile');
        $scope.confirmation = localStorageService.get('confirmation');
        $scope.networks = $scope.profile.user.profile;
        if(!$scope.name){
            $location.path('/profile');
        }
    }

    //
    //  Get listeners
    //
    $scope.current = 0;
    $scope.lockedIn = getUsersData.query();
    $scope.lockedIn.$promise.then(function (result) {
        $scope.individulal = result;
        $scope.cardTypes = $scope.individulal;
        // $scope.cards = Array.prototype.slice.call($scope.cardTypes, 0, 0);
        $scope.count = result.length;
        $scope.count = $scope.count;
        $scope.currentId = result[$scope.current]._id;
    });

    //
    //  Swipe animations
    //
    $scope.cardSwiped = function(index) {
        $scope.addCard();
         if($scope.current < $scope.count - 1){
            $scope.current ++;
        }else{
            $scope.current = 0;
        }
    }

    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
    }

    $scope.addCard = function() {
        var newCard = $scope.cardTypes[Math.floor(Math.random() * $scope.cardTypes.length)];
        newCard.id = Math.random();
        $scope.cards.push(angular.extend({}, newCard));
    }

    $scope.goAway = function() {
        var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
        card.swipe();
    }

    //
    //  Warning Dialog
    //
    $scope.warning = function(){
        if($scope.confirmation = true){
            $location.path('/profiles');
        }else{
            if(confirm('You are about to see content from outside the BBC. The BBC cannot control this comtent, OK to proceed?')){
                $scope.confirmation = true;
                $scope.confirmation = localStorageService.set('confirmation',true);
                $location.path('/profiles');
            }
        }
    }

    $scope.next = function(){
        console.log($scope.current);
       
    }

    $scope.back = function(){
        
        if($scope.current > 0){
            $scope.current --;
        }else{
            $scope.current = $scope.count - 1;
        }
    }

    //
    //  Shout out functinoality
    //
    $scope.shoutOut = function(id){
        alert('Big up yourself ' + $scope.individulal[$scope.current].name + '!');
    }
}