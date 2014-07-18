#POST shoutout/

This call lets notify to the API that the user logged in is shoutting out another user.

**Resource URL**
/shoutout

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
	type: "POST",
	url: url_root+"/shoutout/"
}).done(function(msg) {
   console.log(msg);
});
```

#GET shoutout/

Will return all the shout outs that the user logged in has received.

**Resource URL**
/shoutout

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
	url: url_root+"/shoutout"
}).done(function(msg) {
   console.log(msg);
});
```