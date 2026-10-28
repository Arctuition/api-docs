---
title: Pagination
description: How list endpoints are paginated with page and per_page parameters.
---

List endpoints are paginated. You control pagination with the `page` and `per_page` parameters. Pages start at 1, and the first page is returned if no page is specified.

| Attribute | Type    | In    | Description                                                                 |
| --------- | ------- | ----- | --------------------------------------------------------------------------- |
| per_page  | Integer | query | The number of objects to return per page. Defaults to 10. Maximum is 100.   |
| page      | Integer | query | The page to return, starting at 1. Defaults to 1.                           |

These endpoints are paginated:

- [`GET /projects`](/projects/#query-projects)
- [`POST /projects/search`](/projects/#search-projects) (takes `page` and `per_page` in the JSON body instead of the query string)
- [`GET /projects/<id>/drawings`](/projects/#get-project-drawings)
- [`GET /products`](/products/#query-products)
- [`GET /proposal_templates`](/proposals/#query-proposal-templates)
- [`GET /proposals`](/proposals/#query-proposals)

A paginated response is a plain JSON array. It has no total count and no `Link` header. To fetch every object, request pages one after another until a page returns fewer than `per_page` objects.

:::note
A `per_page` above 100 is treated as 100.
:::
