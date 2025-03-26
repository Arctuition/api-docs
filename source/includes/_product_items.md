# Product Items

You can get product items from a drawing with the following APIs.

- [Proposal Items](#get-proposal-line-items): Product items can be fetched in the way that we generate Product List of Proposal PDF.

![Export Proposal](images/export_proposal.png)

![Export Proposal Sample](images/export_proposal_sample.png)

- [Takeoff Items](#get-takeoff-line-items): Product items can be fetched in the way that we generate Takeoff report in Excel format.

![Export Takeoff](images/export_takeoff.png)

![Export Takeoff Sample](images/export_takeoff_sample.png)

## Get Proposal Line items

```shell
curl "https://api.arcsite.com/v1/drawings/<ID>/line_items" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
{
  "line_items": [
    {
      "name": "product1",
      "quantity": 2.26,
      "total": 0,
      "product_id": "19923123", // not exist for custom price items
      "sku": "sku1", //  not exist for custom price items
      "price": 3.5, //   not exist for custom price items
      "cost": 5, // not exist for custom price items
      "unit": "FT" //   not exist for custom price items
    },
    {
      "name": "product2",
      "quantity": 32.57,
      "total": 128.98,
      "cost": 200
    }
  ],
  "subtotal": 131.24,
  "discount": -31.24,
  "discount_description": "discount reduce",
  "markup": 100,
  "markup_description": "extra fee",
  "taxes": [
    {
      "name": "a",
      "total": 20
    },
    {
      "name": "b",
      "total": 30
    }
  ],
  "total": 250
}
```

Get line items by drawing id.

### HTTP Request

`GET https://api.arcsite.com/v1/drawings/<id>/line_items`

### Query Parameters

| Parameter          | Default          | In    | Description                   |
| ------------------ | ---------------- | ----- | ----------------------------- |
| drawing_version_id | Optional[String] | query | The ID of the drawing version |

<aside class="notice">
If the <code>drawing_version_id</code> is passed, the drawing line items data of the specified version will be returned. If not, the data of the latest version will be returned by default.
</aside>

### Response Schema

| Name                 | Type           | Description                                            |
| -------------------- | -------------- | ------------------------------------------------------ |
| line_items           | List[LineItem] | All product line items                                 |
| subtotal             | Number         | The subtotal of all items before discounts and markups |
| discount             | Number         | The total amount of discount applied                   |
| discount_description | String         | Description or reason for the discount                 |
| markup               | Number         | The total amount of markup added                       |
| markup_description   | String         | Description or reason for the markup                   |
| taxes                | List[TaxItem]  | All taxes applied                                      |
| drawing_version_id   | String         | The version id of the drawing                          |

### LineItem

| Name             | Type                 | Description                                                                             |
| ---------------- | -------------------- | --------------------------------------------------------------------------------------- |
| name             | String               | The name of the product                                                                 |
| quantity         | Number               | The quantity of the product                                                             |
| total            | Number               | Item total after discounts and markup applied                                           |
| price            | Number?              | Item total before discounts and markup applied; not provided for custom price items     |
| cost             | Number?              | Item cost                                                                               |
| sku              | String?              | The stock keeping unit of the product; not provided for custom price items              |
| unit             | String?              | The unit of measurement for the product's quantity; not provided for custom price items |
| product_id       | String?              | The ID of the product; not provided for custom price items                              |
| price_part_items | List[PricePartItem]? | Detail of price part items; not provided for custom price items                         |

### PricePartItem

| Name     | Type   | Description                             |
| -------- | ------ | --------------------------------------- |
| name     | String | The name of price part option           |
| sku      | String | The sku of price part option            |
| price    | Number | The total price of price part option    |
| cost     | Number | The total cost of price part option     |
| quantity | Number | The total quantity of price part option |
| unit     | String | The final unit of price part option     |

### TaxItem

| Name  | Type   | Description             |
| ----- | ------ | ----------------------- |
| name  | String | The name of the tax     |
| total | Number | The total amount of tax |

## Get Takeoff Line items

```shell
curl "https://api.arcsite.com/v1/drawings/<ID>/takeoff_items" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
{
  "takeoff_items": [
    {
      "name": "with attributes",
      "quantity": 300,
      "unit": "Amount",
      "sku": "GM-100",
      "product_id": "287386775856064026",
      "items": [
        {
          "quantity": 1,
          "unit": "Each",
          "sequence_number": "1",
          "attributes": [
            {
              "name": "cc",
              "value": null,
              "type": "TEXT"
            },
            {
              "name": "d",
              "value": "Some text",
              "type": "TEXT"
            },
            {
              "name": "yesno",
              "value": true,
              "type": "CHECKBOX"
            },
            {
              "name": "photo",
              "value": [
                "https://cdn-files-1-test.arcsite.com/36029346774973628/282299611419718/282299611419728/F4AF22A9-F011-4214-8729-CAF3F1F9D9F6.jpg?Expires=1711452610&Signature=sQz~sNF6xPGRPTvPBKyyXgKlA6jh0VSM6mXVpJ63XgYdCE1gat-nT~ZDXtcm~jEoK46UnUWU1ZlXPAiDx5IPwV25X1-pSb~jbXwdlkcz2jPkZPUN-ZWdaCvbMgTLJRvQw-V2RiUyrF83O5GLhJMVut8lfqsGjN3dgh5AtUc53h05dGRYbW-h-d6ItuSbebOTeZSXr8PCSl~n59wgfMRa5DdEilILGNZvGpM2kMaesHYBTiXfv1Z40Fv9rmRa~TLR~tefuEPDpkJWud4aAw7t1GTCSyaeXKL23fELMu~CTWMKvQ-TOqfBsbtBiEzUkrl67qgzDUD1HGimpZ3qweyf-w__&Key-Pair-Id=APKAIZL6W5TJO2AK7DOQ"
              ],
              "type": "PHOTO"
            },
            {
              "name": "start_date",
              "value": "2024-03-25T09:36:42.031Z",
              "type": "DATE"
            }
          ]
        }
      ]
    }
  ]
}
```

Get takeoff items by drawing id.

### HTTP Request

`GET https://api.arcsite.com/v1/drawings/<id>/takeoff_items`

### Query Parameters

| Parameter          | Default          | In    | Description                   |
| ------------------ | ---------------- | ----- | ----------------------------- |
| drawing_version_id | Optional[String] | query | The ID of the drawing version |

<aside class="notice">
If the <code>drawing_version_id</code> is passed, the drawing takeoff items data of the specified version will be returned. If not, the data of the latest version will be returned by default.
</aside>

### Response Schema

| Name          | Type                      | Description                    |
| ------------- | ------------------------- | ------------------------------ |
| takeoff_items | List[TakeffItemByProduct] | Takeoff items group by product |

### TakeffItemByProduct

| Name       | Type              | Description                                        |
| ---------- | ----------------- | -------------------------------------------------- |
| name       | String            | The name of the product                            |
| quantity   | Number            | The total quantity of the product                  |
| unit       | String            | The unit of measurement for the product's quantity |
| sku        | String            | The stock keeping unit of the product              |
| product_id | String            | The ID of the product                              |
| items      | List[TakeoffItem] | The takeoff items of the product                   |

### TakeoffItem

| Name            | Type                   | Description                                                                                                                           |
| --------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| quantity        | Number                 | For geometric products, we use the quantity shown in the drawing. But for shape or virtual products, the quantity is always just one. |
| sequence_number | String                 | Sequence Number for Shape product                                                                                                     |
| unit            | String                 | The input unit defined by the product                                                                                                 |
| attributes      | List[TakeoffAttribute] | The attributes of of the item                                                                                                         |

### TakeoffAttribute

| Name  | Type                          | Description                                                                                |
| ----- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| type  | String                        | The type of the attribute. Can be one of "TEXT", "PHOTO", "CHECKBOX", or "DATE".           |
| value | String, List[String], Boolean | (optional) The value of the attribute. The type of this field depends on the `type` field: |
|       |                               | - If `type` is "TEXT", `value` is a string.                                                |
|       |                               | - If `type` is "PHOTO", `value` is a list of photo URLs.                                   |
|       |                               | - If `type` is "CHECKBOX", `value` is a boolean.                                           |
|       |                               | - If `type` is "DATE", `value` is a string in ISO format.                                  |
