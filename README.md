# Documentation For The Back-End

## Introduction

The requests defined in the documentation are destined for the HOST:PORT where HOST is the server address and PORT is the port where API is running. If API is running localy by default the HOST is 127.0.0.1 and PORT is 8000

## Create (add) an image

Description: the methods adds new image to the database and on success returns empty content with the 201 status code Created. Method is not idempotent and two request would result in two entities created. The entities can be further retrived via the get method.
Endpoint url: ```/image``` \
Method: ```POST``` \
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
  "description": "Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided      to determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she      was doing (she was then limited to one clock)."
}
```

HTTP MIME Response:
```
HTTP/1.1 201 Created
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 0
```
## Get an Image

Description: the method retrieves the images stored in the database. On success returns a json object with image data along the 200 status code OK.
Endpoint url: ```/image``` \
Method: ```GET``` \
Parameters: none

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

[{ "image": "https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg", author": "Grace Hopper", "tags": "programming,linking,navy", "alt": "Image of Grace Hopper at the UNIVAC I console", "description": "Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided    to determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she      was doing (she was then limited to one clock)."}]
```

## Update an Image

Endpoint url: ```/image``` \
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
HTTP MIME Response:
```
HTTP/1.1 204 No Content
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 0
```

## Delete an Image

Endpoint url: ```/image``` \
Method: ```DELETE``` \
JSON Body:
```
{
  "id": Required. Image id to be deleted,
}
```
HTTP MIME Response:
```
HTTP/1.1 204 No Content
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 0
```
