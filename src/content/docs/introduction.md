---
title: Introduction
description: An overview of the ArcSite REST API and its base URL.
---

Welcome to the ArcSite API 👋

The ArcSite API is organized around [REST](https://en.wikipedia.org/wiki/Representational_State_Transfer). Our API has predictable resource-oriented URLs, accepts [JSON-encoded](http://www.json.org/) request bodies, returns [JSON-encoded](http://www.json.org/) responses, and uses standard HTTP response codes, authentication, and verbs.

## Base URL

All API requests are made to the following base URL:

```shell
https://api.arcsite.com/v1
```

## Conventions

- **JSON everywhere** — Requests and responses are JSON-encoded. Send `Content-Type: application/json` on any request that has a body.
- **Timestamps** — Timestamps are in UTC and use the ISO 8601 format with microseconds and a `Z` suffix (for example, `2022-01-16T04:19:23.000000Z`). Payment `paid_time` values are UTC without the suffix (for example, `2025-11-06T10:15:30`).
- **Resource IDs** — Resource IDs are returned as JSON strings. Many are integers larger than 2^53, so keep them as strings (also when you send them back) and treat them as opaque identifiers.
- **Status codes** — The API uses standard HTTP status codes. See the [Errors](/errors/) page for details.
- **Pagination** — List endpoints are paginated with the `page` and `per_page` parameters. See [Pagination](/pagination/) for details.
- **Authentication** — Requests are authenticated with a bearer token header. See [Authentication](/authentication/) for details.
- **Rate limits** — Each company can make up to 5,000 requests per hour. See [Rate limits](/errors/#rate-limits) for details.
