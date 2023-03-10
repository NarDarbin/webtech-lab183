# Documentation For The Back-End

## Introduction

The requests defined in the documentation are destined for the HOST:PORT where HOST is the server address and PORT is the port where API is running. If API is running localy by default the HOST is 127.0.0.1 and PORT is 8000 \
\
**Important**: all the resources serve their response in a JSON format with a ```Content-Type: application/json; charset=utf-8``` header.

## Error Message

Should a request fail the server employs a standardized response: \
HTTP MIME Response:
```
HTTP/1.1 Appropriate HTTP Code
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: Number Of Bytes In The Body

{"message": Error Message}
```
\
Example MIME Response:
```
HTTP/1.1 404 Not Found
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 54

{"message":"Resource is not found"}
```
\
All the possible error codes and their meaning:
Error Code | Description
--- | ---
400 | Bad Request. The required parameters are missing or the parameters served are of wrong datatype (example: id is served as a string)
404 | Not Found. Resource requested was not found
500 | Internal Server Error. Something went wrong on the server side. Should you encounter this error, please contact ```fzovpec2@gmail.com```

## Create (add) an image

### Request

Description: the methods adds new image to the database and on success returns empty content with the 201 status code Created. Method is not idempotent and two request would result in two entities created. The entities can be further retrived via the get method. \
\
Endpoint url: ```HOST:PORT/image``` \
Method: ```POST```

JSON Body Parameters:

Name | Required? | Data Type | Description
--- | --- | --- | ---
author | yes | string | image author
image | yes | string | image url
tags | yes | string | image tags
alt | yes | string | short image description
description | yes | string | image description

JSON Body:
```
{
  "author": ...
  "image": ...
  "tags": ...
  "alt": ...
  "description": ...
}
```

JSON Body Example:
```
{
  "author": "Grace Hopper",
  "image": "https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg",
  "tags": "programming,linking,navy",
  "alt": "Image of Grace Hopper at the UNIVAC I console",
  "description": "Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided      to determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she was doing (she was then limited to one clock)."
}
```
### Successful Response

Response Code: 201 Created \
Response JSON Content: None 

HTTP MIME:
```
HTTP/1.1 201 Created

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 0

```

### Possible Errors

#### Parameter Missing

Code: 400 \
Description: the error occurs when one of the parameters (image, author, tags, alt, or description) is missing. The message specifies which paramenter/s is/are missing.

HTTP MIME Example:
```
HTTP/1.1 400 Bad Request

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 36

{"message":"Author is not present."}
```

#### Server Error

Code: 500 \
Description: when the server fails executing some of its functions. The message highlights the source of the error \

HTTP MIME Example:
```
HTTP/1.1 500 Internal Server Error

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 69

{"message":"database error. Error: SQLITE_ERROR: no such table: sdf"}
```

## Get images

### Request
Description: the method retrieves the images stored in the database. If id is specified, would return only the image data with the corresponding id. If not, would return the whole dataset stored in the database. On success returns a json object with image data along the 200 status code OK. The method is idempotent and safe. I.e running method twice results in the same result  (unless other requests were run in between running these two requests) and the method does not change the database.
\
Endpoint url: ```HOST:PORT/image``` \
Method: ```GET``` \

Query Prameters:

Name | Required? | Data Type | Description 
--- | --- | --- | ---
id | no | integer | image id

Example Request Url:

Without id: ```HOST:PORT/image``` \
With id : ```HOST:PORT/image?id=2```

### Successful Response

Response Code: 200 OK

Response JSON Content: 
```
[
  { 
    "id": ...,
    "image": ..., 
    "author": ..., 
    "tags": ..., 
    "alt": ..., 
    "description": ...
   }
]
```

Response JSON Content Example: 
```
[
  {
    "id":25,
    "image":"https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg",
    "author":"Grace Hopper",
    "tags":"programming,linking,navy",
    "description":"Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided to determine how an alarm clock worked        and dismantled seven alarm clocks before her mother realized what she was doing (she was then limited to one clock).",
    "alt":"Image of Grace Hopper at the UNIVAC I console"
   }
]
```

The response is a JSON object with the following response fields:

Field Name | Data Type | Description
--- | --- | ---
image | string | image url
author | string | image author
tags | string | image tags
alt | string | image short description
description | string | image description

HTTP MIME:
```
HTTP/1.1 200 OK

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: Number Of Bytes In The Response

[{ "id": ..., "image": ..., "author": ..., "tags": ..., "alt": ..., "description": ...}, ...]
```

HTTP MIME Example:
```
HTTP/1.1 200 OK

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 485

[{"id":25,"image":"https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg","author":"Grace Hopper","tags":"programming,linking,navy","description":"Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided      to determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she was doing (she was then limited to one clock).","alt":"Image of Grace Hopper at the UNIVAC I console"}]
```

### Possible Errors

#### Id is not a number

Code: 400 \
Description: the error occurs when the id is provided but is not a number. For example id provided is 's'.

HTTP MIME Example:
```
HTTP/1.1 400 Bad Request

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 32

{"message":"id is not a number"}
```

#### Image by id doesn't exist

Code: 404 \
Description: the error occurs when the id is provided but no corresponding image exist \

HTTP MIME Example:
```
HTTP/1.1 404 Not Found

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 38

{"message":"image by id is not found"}
```

#### Server Error

Code: 500 \
Description: when the server fails executing some of its functions. The message highlights the error source \

HTTP MIME Example:
```
HTTP/1.1 500 Internal Server Error

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 69

{"message":"database error. Error: SQLITE_ERROR: no such table: sdf"}
```


## Update an Image

### Request

Description: the method updates the image entity via its id in the database. Id for a specific image can be retrieved via get method. All the image parameters need to be specified in the image requests. On success, the method returns an empty body along with 204 status code. 

If image by id doesn't exist, new entity is created and 201 status code is returned.
\
Endpoint url: ```HOST:PORT/image``` \
Method: ```PUT``` \

Name | Required? | Data Type | Description
--- | --- | --- | ---
id | yes | integer | image id
author | yes | string | image author
image | yes | string | image url
tags | yes | string | image tags
alt | yes | string | short image description
description | yes | string | image description

JSON Body:
```
{
  "id": ...,
  "image": ...,
  "author": ...,
  "tags": ...,
  "description": ...
}
```
JSON Body Example:
```
{
  "id": 1,
  "author": "Grace Hopper",
  "image": "https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg",
  "tags": "programming,linking,navy",
  "alt": "Image of Grace Hopper at the UNIVAC I console",
  "description": "Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided      to determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she      was doing (she was then limited to one clock)."
}
```

### Successfull Response

Response Code: 201 Created or 204 No Content \
Response JSON Content: None 

HTTP MIME:
```
HTTP/1.1 Appropriate Response Code

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 0
```

HTTP MIME Example:
```
HTTP/1.1 204 No Content

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 0
```

### Possible Errors

#### Id is not a number

Code: 400 \
Description: the error occurs when the id is provided but is not a number \

HTTP MIME Example:

```
HTTP/1.1 400 Bad Request

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 32

{"message":"id is not a number"}
```

#### Server Error

Code: 500 \
Description: when the server fails executing some of its functions. The message highlights the error source \

HTTP MIME Example:
```
HTTP/1.1 500 Internal Server Error

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 69

{"message":"database error. Error: SQLITE_ERROR: no such table: sdf"}
```



## Delete an Image

### Request

Description: the method deletes an image entity by its id from the database. Id for a specific image can be retrieved via the GET method. On succcess returns an empty body along with 204 status code. Method is idempotent, i.e if the request is sent twice the result is the same. If image by id doesn't exist, the database would not delete any entities.
\
Endpoint url: ```HOST:PORT/image``` \
Method: ```DELETE``` \

JSON Body Parameters:

Name | Required? | Data Type | Description
--- | --- | --- | ---
id | yes | integer | image id

JSON Body:
```
{
  "id": ...,
}
```
JSON Body Example:
```
{
  "id": 1,
}
```

### Sucessfull Response

Response Code: 204 No Content \
Response JSON Content: None 

HTTP MIME:
```
HTTP/1.1 204 No Content

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 0
```

### Possible Errors

#### Id is not a number

Code: 400 \
Description: the error occurs when the id is provided but is not a number \

HTTP MIME Example:
```
HTTP/1.1 400 Bad Request

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 32

{"message":"id is not a number"}
```

#### Server Error

Code: 500 \
Description: when the server fails executing some of its functions. The message highlights the error source \

HTTP MIME Response Example:
```
HTTP/1.1 500 Internal Server Error

X-Powered-By: Express
Access-Control-Allow-Origin: *
Connection: keep-alive
Keep-Alive: timeout=5
Date: Wed, 01 Feb 2023 10:41:36 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 69

{"message":"database error. Error: SQLITE_ERROR: no such table: sdf"}
```
