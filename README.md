# Documentation For The Back-End

## Create (add) an image

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

HTTP MIME Response:
```
HTTP/1.1 201 Created
Accept-Ranges: bytes
Content-Type: application/json
Content-Length: 0
```
## Get an Image

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
