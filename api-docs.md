# RanChat Api Documentation

## 1. Guest API

1. **Create a new guest on application connect**

`POST /guest/addGuest`

**_Description_**

- Registering new **guest** to _mongoDB_

**_Response_**

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

## 3. Payment API

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
	"token": <Midtrans  payment  gateway  token>,
	"redirect_url": <Midtrans  payment  gateway  redirect  url>,
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
