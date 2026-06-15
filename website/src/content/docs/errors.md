---
title: Errors
description: HTTP response codes the ArcSite API returns to indicate request success or failure.
---

ArcSite uses HTTP response codes to indicate the success or failure of a request. Codes within the 2xx range are considered as successfully completed requests. Codes within the 4xx and 5xx ranges will indicate that a failure has occurred.

We use the following error codes to manage common failures.

The ArcSite API uses the following error codes:

| Error Code         | Meaning                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------- |
| 400                | Bad Request -- Your request is invalid.                                                 |
| 401                | Unauthorized -- Your API token is wrong.                                                |
| 404                | Not Found -- The specified resource could not be found.                                 |
| 405                | Method Not Allowed -- You tried to access an API with an invalid method.                |
| 406                | Not Acceptable -- You requested a format that isn't json.                               |
| 429                | Too Many Requests. -- You have sent too many requests in a given amount of time.        |
| 500, 502, 503, 504 | There is an issue with ArcSite. These are rare and we will be messaged when they occur. |
|                    |
