#GET users/all/:numpage

This call will return a list of all the users that are lockedIn at this moment with all their information. With the parameter of **numpage** will specify the page number that we want to show. The pages will show 15 elements, variable predefined at the server.

**Resource URL**
/users/all/:numpage

##Parameters
*No parameters*

##Headers

**Authorization** type **Bearer**

##Example
```javascript
$.ajax({
	beforeSend: function (xhr) {
		xhr.setRequestHeader ("Authorization", "Bearer "+token);
	},
	type: "GET",
	url: url_root+"/users/all/1"
}).done(function(msg) {
   console.log(msg);
});
```

#GET users/number

The call will return only an integer, that will be the number of users connected to the app at this moment.

**Resource URL**
/users/number

##Parameters
*No parameters*

##Headers

**Authorization** type **Bearer**

##Example
```javascript
$.ajax({
	beforeSend: function (xhr) {
		xhr.setRequestHeader ("Authorization", "Bearer "+token);
	},
	type: "GET",
	url: url_root+"/users/number"
}).done(function(msg) {
   console.log(msg);
});
```