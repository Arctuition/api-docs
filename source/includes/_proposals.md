# Proposals

## Query Proposal Templates

```shell
curl "https://api.arcsite.com/v1/proposal_templates" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": "36029621652695041",
    "name": "Proposal Template 1"
  }
]
```

Returns a list of proposal templates of your organization.

### HTTP Request

`GET https://api.arcsite.com/v1/proposal_templates`

### Query Parameters

| Parameter | Default | In    | Description             |
| --------- | ------- | ----- | ----------------------- |
| page      | 1       | query | Request a specific page |
| per_page  | 10      | query | Page size               |

## Get Proposal

```shell
curl "https://api.arcsite.com/v1/proposal/<ID>" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
{
  "id": "36029621652695040",
  "name": "project 4",
  "created_at": "2022-01-16T04:19:23",
  "approved_proposal_pdf_url": "https://api.arcsite.com/v1/proposal/36029621652695040.pdf"
}
```

<aside class="notice">
The approved_proposal_pdf_url field might be null if the proposal hasn’t been approved yet. For proposals that have been signed, the pdf_url will point to the final signed document.

</aside>

Returns proposal of your organization by proposal id.

### HTTP Request

`GET https://api.arcsite.com/v1/proposal/<id>`
