angular.module('logIn', ['ngResource'])
    .factory('logInData', function($resource){
        //return $resource('assets/js/login.json', {} , { 'query' : { method : 'get', isArray : false}});
        return $resource('http://localhost:5000/api/auth/facebook', {} , { 'query' : { method : 'get', isArray : false}});
    })
        //return $resource(' http://lockedinapi.herokuapp.com/api/users', {} , { 'query' : { method : 'get', isArray : false}});
    .factory('getUsersData', function($resource){
        return $resource('http://lockedinapi.herokuapp.com/api/users', {} , { 'query' : {method : 'get', isArray : true}});
    });