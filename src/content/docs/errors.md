---
title: Errors
description: HTTP response codes the ArcSite API returns to indicate request success or failure.
---

ArcSite uses HTTP response codes to indicate the success or failure of a request. Codes within the 2xx range are considered as successfully completed requests. Codes within the 4xx and 5xx ranges will indicate that a failure has occurred.

## Error response body

Most error responses include a JSON body with a human-readable `message` that explains what went wrong:

```json title="Error response"
{
  "message": "Project name Backyard Fence already exists, please use another name."
}
```

Treat `message` as text for logs and people, not as a stable identifier: branch on the HTTP status code. A `401` response usually has an empty body (`{}`), a request to a URL that doesn't exist (including a trailing `/` on an endpoint path) returns a `404` with an HTML body, and an unexpected server error returns a `500` whose body has a different shape.

## Status codes

| Error Code         | Meaning                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 400                | Bad Request -- Your request is invalid: a required field is missing, a value has the wrong type, or the request body isn't valid JSON.        |
| 401                | Unauthorized -- The `Authorization` header is missing or malformed, or the API token is wrong or has been deleted.                            |
| 403                | Forbidden -- The resource exists but belongs to an organization your API token can't access.                                                  |
| 404                | Not Found -- The specified resource could not be found.                                                                                       |
| 405                | Method Not Allowed -- You tried to access an API with an invalid method.                                                                      |
| 406                | Not Acceptable -- The request has a body whose `Content-Type` isn't `application/json` (or `multipart/form-data` for file uploads).           |
| 429                | Too Many Requests -- You have exceeded the [rate limit](#rate-limits).                                                                        |
| 500, 502, 503, 504 | There is an issue with ArcSite. These are rare and we will be messaged when they occur.                                                       |

## Rate limits

Each company can make up to 5,000 API requests per hour. The limit counts requests to all endpoints and is shared by all API tokens of the company. The count resets at the start of each hour (UTC).

Requests over the limit return `429 Too Many Requests`:

```json title="Rate limit response"
{
  "message": "Too many requests. Please wait before trying again."
}
```

When you receive a `429`, wait until the next hour starts before you retry.
