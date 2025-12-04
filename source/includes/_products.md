# Products

## Query products

```shell
curl "https://api.arcsite.com/v1/products" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": "1",
    "name": "product 1",
    "sku": "abc",
    "description": "product 1 description",
    "cost": 20.0
  }
]
```

Returns a list of products for your organization. By default, products are sorted by creation time in descending order (most recent first).

### HTTP Request

`GET https://api.arcsite.com/v1/products`

### Query Parameters

| Parameter | Default    | In    | Description                                           |
| --------- | ---------- | ----- | ----------------------------------------------------- |
| page      | 1          | query | Request a specific page                               |
| per_page  | 10         | query | Page size                                             |
| order_by  | create_at  | query | Sort field. Options: `create_at`, `update_at`         |
| order     | desc       | query | Sort order. Options: `asc` (ascending), `desc` (descending) |
