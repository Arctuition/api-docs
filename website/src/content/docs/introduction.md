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
- **Timestamps** — Timestamps are in UTC and use the ISO 8601 format (for example, `2022-01-16T04:19:23`).
- **Resource IDs** — Resource IDs are large integers and may be returned as JSON strings in some responses. Treat them as opaque identifiers.
- **Status codes** — The API uses standard HTTP status codes. See the [Errors](/errors/) page for details.
- **Pagination** — List endpoints are paginated with the `page` and `per_page` parameters. See [Pagination](/pagination/) for details.
- **Authentication** — Requests are authenticated with a bearer token header. See [Authentication](/authentication/) for details.
