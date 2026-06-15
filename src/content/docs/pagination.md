---
title: Pagination
description: How list endpoints are paginated with page and per_page parameters.
---

All list operations are paginated in a similar fashion to the GitHub API. In most cases we paginate requests returning more than 100 results. You can control pagination with the `page` and `per_page` parameters. Pages start at 1, and the first page is returned if no page is specified.

| Attribute | Type    | In    | Description                                                                         |
| --------- | ------- | ----- | ----------------------------------------------------------------------------------- |
| per_page  | Integer | query | The total number of objects that can be returned. Defaults to 10.                   |
| page      | Integer | query | The current page offset. Increasing this number will multiply limit. Defaults to 1. |

:::note
Max `per_page` is 100.
:::
