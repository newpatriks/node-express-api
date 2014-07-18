+ [Register / Login](#post_user)
+ [Information about the user](#get_user)
+ [Remove the user](#remove_user)
+ [Merge social networks](#post_usermerge)
+ [Logout session](#post_userlogout)

#<a name="post_user"></a>POST user/

Will create a user and will be saved at mongodb. This call will return a valid token as well. The token will be valid for the next 60 minutes, and will be saved in a Redis db. Each next call will need this token be sent throught the Headers parameters.

**Resource URL**
/user

##Parameters
The parameters can come from facebook or twitter or instagram or google+. The schema should be like:

```javascript
var profile = {
	social : 'facebook', // We have to specify which social network we're going to use to register/login.
   token : '',
   facebook: {
		"email": "test@lockedin.com",
		"first_name": "Test",
		"gender": "male",
		"id": "123456789012345678",
		"last_name": "Test",
		"link": "https://www.facebook.com/app_scoped_user_id/id_test/",
		"locale": "en_UK",
		"name": "Test",
		"picture": "http://graph.facebook.com/id_test/picture",
		"thumbnail": "http://graph.facebook.com/id_test/picture",
		"timezone": "1",
		"updated_time": "2014-02-08T16:31:07+0000",
		"verified": "true",
		"music": {
			"data": [{
				"category": "Musician/band",
				"created_time" : "2013-03-25T18:02:40+0000",
				"id": "99636325744",
	          "name": "Band name 1"
			},{
				"category": "Musician/band",
				"created_time" : "2014-07-25T18:02:40+0000",
	          "id": "99636325744",
				"name": "Band name 2"
			}]
		}
	},
	twitter : {},
	instagram : {}
};
```


##Headers

*No need headers*

##Example

```javascript
$.ajax({
	type: "POST",
	url: url_root+"/users",
	data: profile
}).done(function(msg) {
	console.log(msg);
});
```

#<a name="get_user"></a>GET user/

Will return the information of the user logged in. Does not need any get parameter, only the token at the header. 

**Resource URL**
/user

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
	url: url_root+"/user",
   data: data
}).done(function(msg) {
   console.log(msg);
});
```

#<a name="delete_user"></a>DELETE user/

Will remove the user that are logged in. 

**Resource URL**
/user

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
	type: "DELETE",
	url: url_root+"/user"
}).done(function(msg) {
   console.log(msg);
});
```
#<a name="post_usermerge"></a>POST user/merge

This call will merge the information about the user is logged in, with the information that we are sending. The point is to be possible to merge different social networks accounts to the same user.

**Resource URL**
/user/merge

##Parameters
```javascript
var profile = {
	social : 'twitter',
	token : token,
	facebook    : {},
	twitter     : {
		"email": "newpatriks@gmail.com",
	   "name": "Jordi",
		"location": "London",
		"username": "newpatriks"
	},
	instagram : {}
};
```


##Headers

**Authorization** type **Bearer**

##Example
```javascript
$.ajax({
	beforeSend: function (xhr) {
		xhr.setRequestHeader ("Authorization", "Bearer "+token);
	},
	type: "POST",
	url: url_root+"/user/merge",
   data: profile
}).done(function(msg) {
   console.log(msg);
});
```
#<a name="post_userlogout"></a>POST user/logout

This call will logout the session of the user logged in.

**Resource URL**
/user/logout

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
	url: url_root+"/user/logout",
}).done(function(msg) {
   console.log(msg);
});
```