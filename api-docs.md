# RanChat Api Documentation

## 1. Guest API

1. **Create a new guest on application connect**

`POST guest/addGuest`

**_Description_**

- Registering new **guest** to _mongoDB_

**_Response_**

- **Body**

_201 - Created_

```json
{
	"acknowledged": true,
	"insertedId": String
}
```

---

2. **Fetch all guests that connected to application**

`GET /guest`

**_Description_**

- Fetch all available **guest** from _mongoDB_

**_Response_**

- **Body**

_200 - OK_

```json
[
	{
		"_id": String,
		"identifier": String,
		"guest": String
	},
	...
]
```

---

3. **Fetch ONE guest that connected to application**

`GET /guest/:id`

**_Description_**

- Fetch an available **guest** from _mongoDB_

**_Response_**

- **Body**

_200 - OK_

```json
{
	"_id": String,
	"identifier": String,
	"guest": String
}
```

---

4. **Delete ONE guest that disconnected from application**

`DELETE /guest/:id`

**_Description_**

- Delete a **guest** from _mongoDB_

**_Response_**

- **Body**

_200 - OK_

```json
{
  "acknowledged": true,
  "deleteCount": 1
}
```

---

### 5,6,7 is unfinished and need to be reworked when _wiring_

5. **Find a Room with one empty seats**

`GET /guest/randomRoom`

**_Description_**

- Fetch a room for guest to enter

**_Response_**

- **Body**
- _200 - OK_

```json
{
	{
		"_id": String,
		"guestCaller": String,
		"guestCalled": String
	}
}
```

---

6. **Create a new guest room**

`POST /guest/randomRoom`

**_Description_**

- Create a room for guest if no available room on the current time

**_Request_**

- **Body**

```json
{
	"guestSocketId": String
}
```

**_Response_**

- **Body**

_200 - OK_

```json
{
  "acknowledged": true,
  "modifiedCount": 0,
  "upserted": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

_200 - OK_

```json
{
  "acknowledged": true,
  "deleteCount": 1
}
```

---

7. **Delete an empty room**

`DELETE /guest/randomRoom/:roomId`

**_Description_**

- Delete a room if a guest hang-up or disconnected

**_Response_**

- **Body**

_200 - OK_

```json
{
  "acknowledged": true,
  "deleteCount": 1
}
```

---

## 2. User API

1.  **Create a new User**

`POST user/register`

**_Description_**

- Registering a new User

**_Request_**

- **Body**

```json
{
	"fullName": String,
	"email": String,
	"password": String,
}
```

**_Response_**

_201 - Created_

- **Body**

```json
{
 "id": Number,
 "fullName": String,
 "email": String
}
```

_400 - Bad Request_

- **Body**

```json
{
	"message": String
}
```

---

2.  **Login registered User**

`POST user/login`

**_Description_**

- Sign in registered User

**_Request_**

- **Body**

```json
{
	"email": String,
	"password": String,
}
```

**_Response_**

_200 - OK_

- **Body**

```json
{
	"access_token": <your access token>,
	"profile": {
		"id": Number,
		"fullName": String,
		"email": String,
		"isVerified": Boolean,
		"status": Boolean
	}
}
```

_400 - Bad Request_

- **Body**

```json
{
  "message": "Email/password is required"
}
```

_401 - Unauthorized_

- **Body**

```json
{
  "message": "Email/password is invalid"
}
```

---

3.  **Verify new User email**

`POST user/verify`

**_Description_**

- Verification of new User Email

**_Request_**

- **Header**

```json
{
	"access_token": <your access token>
}
```

- **Body**

```json
{
	"verificationCode": <your verification  code>,
}
```

**_Response_**

_200 - OK_

- **Body**

```json
{
  "message": "Email successfully verified"
}
```

_400 - Bad Request_

- **Body**

```json
{
  "message": "Please enter verification code"
}
```

_400 - Bad Request_

- **Body**

```json
{
  "message": "Verification code is not valid"
}
```

---

4.  **Create new User Profile Detail**

`POST user/profile`

**_Description_**

- Create new Profile Detail

**_Request_**

- **Header**

```json
{
	"access_token": <your access token>
}
```

- **Body**

```json
{
	"profilePicture": String,
	"birthday": Date,
	"address": String,
	"gender": String,
	"bio": String,
	"banner": String,
	"facebook": String,
	"instagram": String,
	"twitter": String,
	"UserId": Integer
}
```

**_Response_**

_201 - Created_

- **Body**

```json
{
	"profilePicture": String,
	"birthday": Date,
	"address": String,
	"gender": String,
	"bio": String,
	"banner": String,
	"facebook": String,
	"instagram": String,
	"twitter": String,
	"UserId": Integer
}
```

---

5.  **Fetch User Profile Detail**

`GET user/profile`

**_Description_**

- Create new Profile Detail

**_Request_**

- **Header**

```json
{
	"access_token": <your access token>
}
```

**_Response_**

_200 - Created_

- **Body**

```json
{
	"profilePicture": String,
	"birthday": Date,
	"address": String,
	"gender": String,
	"bio": String,
	"banner": String,
	"facebook": String,
	"instagram": String,
	"twitter": String,
	"UserId": Integer
}
```

---

## 3. Friends API

1.  **Fetch all current user Friends**

`GET /friends`

**_Description_**

- Fetching all User Friends

**_Request_**

- **Header**

```json
{
	"access_token": <your access token>
}
```

**_Response_**

_200 - OK_

- **Body**

```json
{
 "friendList": [
	 {
		 "id": Integer,
		 "UserId": Integer,
		 "FriendId": Integer,
		 "friendStatus": Boolean,
		 "createdAt": Date,
		 "updatedAt": Date,
		 "FriendData": {
			 "id": Integer,
			 "fullName": String,
			 "email": String,
			 "isVerified": Boolean,
			 "verificationCode": String,
			 "status": Boolean,
			 "isPremium": Boolean
		 }
	 },
	 ...
 ]
}
```

---

2.  **Send a Friend Request**

`POST /friends`

**_Description_**

- Send a friend request

**_Request_**

- **Header**

```json
{
	"access_token": <your access token>
}
```

- **Body**

```json
{
	"friendId": Integer
}
```

**_Response_**

_201 - Created_

- **Body**

```json
{
	 "friend": {
		 "id": Integer
	 }
}
```

_401 - Bad Request_

- **Body**

```json
{
  "message": "Duplicate friend request"
}
```

_404- Not Found_

- **Body**

```json
{
  "message": "User Not Found"
}
```

---

3.  **Fetch all Friend Request**

`GET /friends/request`

**_Description_**

- Fetch all Friend Request of current user

**_Request_**

- **Header**

```json
{
	"access_token": <your access token>
}
```

**_Response_**

200 - OK\_

- **Body**

```json
{
	 "friendRequestList": [
		 {
			 "id": Integer,
			 "UserId": Integer,
			 "FriendId": Integer,
			 "friendStatus": false,
			 "createdAt": Date,
			 "updatedAt": Date,
			 "userData": {
				 "id": Integer,
				 "fullName": String,
				 "email": String,
				 "password": String,
				 "status": Boolean,
				 "isPremium": Boolean,
				 "createdAt": Date,
				 "updatedAt": Date
			 }
		 },
		 ...
	 ]
}
```

---

4.  **Accepting Specific Friend Request**

`PATCH /friends/:friendId`

**_Description_**

- Accepting specific friend request

**_Request_**

- **Header**

```json
{
	"access_token": <your access token>
}
```

**_Response_**

200 - OK\_

- **Body**

```json
{
  "message": "Success Accept Friend Request"
}
```

---

5.  **Rejecting Specific Friend Request**

`DELETE /friends/request/:friendId`

**_Description_**

- Rejecting a specific friend request

**_Request_**

- **Header**

```json
{
	"access_token": <your access token>
}
```

**_Response_**

200 - OK\_

- **Body**

```json
{
  "message": "Success Reject Friend Request"
}
```

---

6.  **Delete an existing friend**

`DELETE /:friendId`

**_Description_**

- Delete a Specific Friend

**_Request_**

- **Header**

```json
{
	"access_token": <your access token>
}
```

**_Response_**

200 - OK\_

- **Body**

```json
{
  "message": "Success Delete Friend"
}
```

---

## 4. Payment API

1.  **Create User payment history**

`POST /payment`

**_Description_**

- Create new User Payment

**_Request_**

- **Header**

```json
{
	"access_token": <your access token>
}
```

**_Response_**

_200 - OK_

- **Body**

```json
{
	"token": <Midtrans payment gateway token>,
	"redirect_url": <Midtrans payment gateway redirect url>,
}
```

_403 - Forbidden_

- **Body**

```json
{
  "message": "Your email is not verified"
}
```

---

### Global Error

---

**_Response_**

_401 - Unauthorized_

- **Body**

```json
{
  "message": "Invalid token"
}
```

---

_500 - Internal Server Error_

- **Body**

```json
{
  "message": "Internal Server Error"
}
```
