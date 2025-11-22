# Field Data

You can get field data values from a drawing with the following APIs.

## Get Drawing Field Data

```shell
curl "https://api.arcsite.com/v1/drawings/<ID>/field_data" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
{
  "groups": [
    {
      "name": "Default Group",
      "field_data": [
        {
          "name": "Property Address",
          "type": "TEXT",
          "value": "Address 1, Address 2"
        },
        {
          "name": "No Visible Evidence",
          "type": "SWITCH",
          "value": true
        },
        {
          "name": "Sign by Seller(s) or Owner",
          "type": "SELECT",
          "value": ["Seller(s)"]
        }
      ]
    }
  ]
}
```

Get field data value by drawing id.

### HTTP Request

`GET https://api.arcsite.com/v1/drawings/<id>/field_data`

### Query Parameters

| Parameter          | Default          | In    | Description                   |
| ------------------ | ---------------- | ----- | ----------------------------- |
| drawing_version_id | Optional[String] | query | The ID of the drawing version |

<aside class="notice">
If the <code>drawing_version_id</code> is passed, the field data of the specified drawing version will be returned. If not, the field data of the latest version will be returned by default.
</aside>

### Response Schema

| Name   | Type        | Description                              |
| ------ | ----------- | ---------------------------------------- |
| groups | List[Group] | List of field data groups in the drawing |

### Group

| Name       | Type            | Description                                |
| ---------- | --------------- | ------------------------------------------ |
| name       | String          | The name of the field data group           |
| field_data | List[FieldData] | List of field data items within this group |

### FieldData

| Name  | Type   | Description                                                                                                                            |
| ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| name  | String | The name of the field                                                                                                                  |
| type  | String | The type of the field. Possible values: TEXT, SWITCH, SELECT, DATE, etc.                                                               |
| value | Any    | The value of the field. The data type depends on the field type: String for TEXT/DATE, Boolean for SWITCH, Array of Strings for SELECT |

<aside class="notice">
The <code>value</code> field type varies based on the <code>type</code> field:
<ul>
  <li><code>TEXT</code>, <code>DATE</code>: Returns a String value</li>
  <li><code>SWITCH</code>: Returns a Boolean value (true/false)</li>
  <li><code>SELECT</code>: Returns an Array of Strings (supports multiple selections)</li>
</ul>
</aside>
