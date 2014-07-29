#POST user/

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

#GET user/

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

#DELETE user/

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

#PUT user/

This call is to update the information about the user. Let us to change the picture and the description showed on the app.

**Resource URL**
/user

##Parameters

The parameters has to be an entire object of the user information. The object has to have the 'preferences' field:

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
	instagram : {},
	preferences : {
		image: '...',
		description: '...'
	},
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
	type: "PUT",
	data : profile
	url: url_root+"/user",
}).done(function(msg) {
   console.log(msg);
});
```

#GET user/preferences

Will return the information in USER > PREFERENCES only.

**Resource URL**
/user/preferences

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
	url: url_root+"/user/preferences",
   data: data
}).done(function(msg) {
   console.log(msg);
});
```


#POST user/merge

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
#POST user/logout

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

#PUT /user/online/

Call to modify the user status on the application. When the users close the app the system will call to this call to "disconnect" the user but not logout.

**Resource URL**
/user/online

##Parameters

The parameters has to be an entire object of the user information. The object has to have the 'preferences' field:

```javascript
var data = { connected : false }
```

#POST user/reftoken

This is to regenerate a new token for the users that are logged in and the token has expired. The idea is that when another call returns a 401 HTTP code, will call this function and will check if the user is online or not.

**Resource URL**
/user/reftoken

##Parameters
*No parameters*

##Headers

**Authorization** type **Bearer**

##Example
```javascript
var token = "";
actionRequested();

function actionRequested() {
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer "+token);
        },
        type: "GET",
        url: url_root+"/user",
        error : function(xhr, msg) {
            if (xhr.status === 401) {
                // REFRESH TOKEN
                $.ajax({
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Bearer "+token);
                    },
                    type: "POST",
                    url: url_root+"/user/reftoken"
                }).done(function(msg) {
                    token = msg.token;
                    // Recursive call to re-enter at the function and succeed on the ajax call.
                    actionRequested();
                });            
            }
        }
    }).done(function(msg, xhr) {
        console.log(xhr + " | "+ msg);
    });    
}
```