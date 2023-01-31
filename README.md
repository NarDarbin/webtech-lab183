# Documentation For The Back-End

## Introduction

The requests defined in the documentation are destined for the HOST:PORT where HOST is the server address and PORT is the port where API is running. If API is running localy by default the HOST is 127.0.0.1 and PORT is 8000

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

## Create (add) an image

### Request

Description: the methods adds new image to the database and on success returns empty content with the 201 status code Created. Method is not idempotent and two request would result in two entities created. The entities can be further retrived via the get method. \
\
Endpoint url: ```HOST:PORT/image``` \
Method: ```POST```

### Successful Response
JSON Body:
```
{
  "author": Required. Author's name
  "image": Required. Image url
  "tags": Required. Tags
  "alt": Required. Image short description
  "description": Required. Image description
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

HTTP MIME Response:
```
HTTP/1.1 201 Created
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 0
```

### Possible Errors

#### Parameter Missing

Code: 400 \
Description: the error occurs when one of the parameters (image, author, tags, alt, or description) is missing. The message signifies which paramenter/s is/are missing \

HTTP MIME Response Example:
```
HTTP/1.1 400 Bad Request
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 54

{"message":"image is missing"}
```

#### Server Error

Code: 500 \
Description: when the server fails executing some of its functions. The message highlights the source of the error \

HTTP MIME Response Example:
```
HTTP/1.1 500 Internal Server Error
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 54

{"message":"database error: sql connection failed"}
```

## Get images

### Request
Description: the method retrieves the images stored in the database. If id is specified, would return only the image data with the corresponding id. If not, would return the whole dataset stored in the database. On success returns a json object with image data along the 200 status code OK. The method is idempotent and safe. I.e running method twice results in the same result  (unless other requests were run in between running these two requests) and the method does not change the database. \
\
Endpoint url: ```HOST:PORT/image``` \
Method: ```GET``` \
Parameters:

Key | Required | Description 
--- | --- | --- 
id | Not Required | id of the image for retrieval

### Successful Response

HTTP MIME Response:
```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: number of bytes in the response

[{ "image": ..., "author": ..., "tags": ..., "alt": ..., "description": ...}, ...]
```

HTTP MIME Response Example:
```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: number of bytes in the response

[{ "image": "https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg", author": "Grace Hopper", "tags": "programming,linking,navy", "alt": "Image of Grace Hopper at the UNIVAC I console", "description": "Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided    to determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she was doing (she was then limited to one clock)."}]
```

### Possible Errors

#### Id is not a number

Code: 400 \
Description: the error occurs when the id is provided but is not a number \

HTTP MIME Response Example:
```
HTTP/1.1 400 Bad Request
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 54

{"message":"id is not a number"}
```

#### Image by id doesn't exist

Code: 404 \
Description: the error occurs when the id is provided but no corresponding image exist \

HTTP MIME Response Example:
```
HTTP/1.1 404 Not Found
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 54

{"message":"image by id isn't found"}
```

#### Server Error

Code: 500 \
Description: when the server fails executing some of its functions. The message highlights the source of the error \

HTTP MIME Response Example:
```
HTTP/1.1 500 Internal Server Error
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 54

{"message":"database error: sql connection failed"}
```


## Update an Image

Description: the method updates the image entity via its id in the database. Id for a specific image can be retrieved via get method. All the image parameters need to be specified in the image requests. On success, the method returns an empty body along with 204 status code. \
\
Endpoint url: ```HOST:PORT/image``` \
Method: ```PUT``` \
JSON Body:
```
{
  "id": Required. Image id to be updated,
  "image": Required. Image url,
  "author": Required. Image author,
  "tags": Required. Image tags,
  "description": Required. Image description
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

HTTP MIME Response:
```
HTTP/1.1 204 No Content
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 0
```

### Possible Errors

#### Id is not a number

Code: 400 \
Description: the error occurs when the id is provided but is not a number \

HTTP MIME Response Example:

```
HTTP/1.1 400 Bad Request
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 54

{"message":"id is not a number"}
```

#### Server Error

Code: 500 \
Description: when the server fails executing some of its functions. The message highlights the source of the error \

HTTP MIME Response Example:
```
HTTP/1.1 500 Internal Server Error
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 54

{"message":"database error: sql connection failed"}
```



## Delete an Image

Description: the method deletes an image entity by its id from the database. Id for a specific image can be retrieved via the GET method. On succcess returns an empty body along with 204 status code. Method is idempotent, i.e if the request is sent twice the result is the same. \
\
Endpoint url: ```HOST:PORT/image``` \
Method: ```DELETE``` \
JSON Body:
```
{
  "id": Required. Image id to be deleted,
}
```
JSON Body Example:
```
{
  "id": 1,
}
```

HTTP MIME Response:
```
HTTP/1.1 204 No Content
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 0
```

### Possible Errors

#### Id is not a number

Code: 400 \
Description: the error occurs when the id is provided but is not a number \

HTTP MIME Response Example:
```
HTTP/1.1 400 Bad Request
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 54

{"message":"id is not a number"}
```

#### Server Error

Code: 500 \
Description: when the server fails executing some of its functions. The message highlights the source of the error \

HTTP MIME Response Example:
```
HTTP/1.1 500 Internal Server Error
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 54

{"message":"database error: sql connection failed"}
```
