# Drawings

## Get Drawing

```shell
curl "https://api.arcsite.com/v1/drawings/<ID>" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
{
  "id": "36029621652695015",
  "project_id": "28123123123",
  "name": "Drawing_1_Pre-Survey_Proposal (1)-page_03_test-page_02",
  "pdf_url": "https://d1umxpetlubu85.cloudfront.net/36029346774787878/36029621652694930/40c01b5a-75d5-11ec-8ea1-0242ac170007/Drawing_1_Pre-Survey_Proposal_-281-29-page_03_test-page_02.pdf?Expires=1642318765&Signature=Lh9XnGwEtt5DdZx4GAdp7J5qbJArHKS~lY39y2OjDsSRzpXPuv6H4x0RxfqYGi6gqrZxv56GMn2MiQXN9cM2VotAMpGWBsjm4cabdpLSXZNuhtqJ4k9~VBr3EyhgGIlIQk2HUlb-~McPlfbGNrbGbzj3P5mpEZ0Ce00OG0WUs3eolPEom9s4v7QNwWRrsyltFvEhZ~T4S8tRDCjyHa50al6GsNCLb5sBX7pW~oem2~GKGYj3a-kDuzCQiKLp4K7Ncc2njmDwVHThI9aSIlggbuejBa~XbWUf2WNgcbUq0~i0-e~yVN212~Qh7vHcXV4XFXQ-7k3zdxfLE8m9il5Ufg__&Key-Pair-Id=APKAIZL6W5TJO2AK7DOQ",
  "png_url": "https://d1umxpetlubu85.cloudfront.net/36029346774787878/36029621652694930/40c01b5a-75d5-11ec-8ea1-0242ac170007/Drawing_1_Pre-Survey_Proposal_-281-29-page_03_test-page_02.png",
  "dxf_url": "https://cdn-files-1-test.arcsite.com/36029346774973628/36029621653508440/_attach_282299611393362/Web_hook_location_photo.dxf?Expires=1711623376&Signature=qZSQPST2tdtKM9URUDEIdnwJiXSpNxRabMtmjg6hzdizcVmKJ4UIF-F~0LLiF1LT2y~vbx73CHDNFhZZgBNSjzWszV123qWOn68NyfU6fMdWRlMu4P51q7SWRmxMTlcnMGrF8F29HeilhnZOhBTiF~9oHPa62KRM7Duuq6z-T1RAF7w8mcZH46N4A3wXUyvcIeTaX4jbxCLQ83l2AGsFonD-NVwjeeuNba3MnrwpsTdBIUEbZXnRHNWYJx0i0HhENpr4xJLnX0lDAh9fXI2Zfo8MIapbm7iz8IhTUkwjRdjWU35uabdob1YJ19qVEMoHMqjnftEEkw7n44CYBYUY9w__&Key-Pair-Id=APKAIZL6W5TJO2AK7DOQ"
}
```

Returns drawing of your organization by project drawing id,

### HTTP Request

`GET https://api.arcsite.com/v1/drawings/<id>`

### Query Parameters

| Parameter          | Default          | In    | Description                   |
| ------------------ | ---------------- | ----- | ----------------------------- |
| drawing_version_id | Optional[String] | query | The ID of the drawing version |

### Response Schema

| Name       | Type               | Description             |
| ---------- | ------------------ | ----------------------- |
| id         | String             | The ID of the drawing   |
| project_id | String             | The ID of the project   |
| name       | String             | The name of the drawing |
| pdf_url    | String &#124; null | The URL of the PDF file |
| png_url    | String &#124; null | The URL of the PNG file |
| dxf_url    | String &#124; null | The URL of the DXF file |

<aside class="notice">
If the <code>drawing_version_id</code> is passed, the data of the specified version will be returned. If not, the data of the latest version will be returned by default.
</aside>

<aside class="notice">
Please note that all URLs are not guaranteed and may be null if the app fails to upload to the cloud.

The returned urls will expire in 24 hours.

</aside>

<aside class="notice">
The pdf could take some time(often less than 1 minute) to generate if the drawing contains location based photos, the <code>pdf_url</code> could be null before it has been generated.
</aside>

## Export Customer Proposal PDF for drawing

```shell
curl "https://api.arcsite.com/v1/export_proposal_pdf" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
{
  "url": "https://d1umxpetlubu85.cloudfront.net/36029346774973628/36029621653386370/36029621653386685/c6f62f3d-db06-42df-8138-91d80e792e5d/Drawing_1_Pre-Survey_Proposal_-281-29-page_03_test-page_02_test.pdf"
}
```

Export Customer Proposal PDF for some drawing by giving the proposal template id.

### HTTP Request

`POST https://api.arcsite.com/v1/export_proposal_pdf`

### Parameters

| Parameter   | Type   | Description                                                                       |
| ----------- | ------ | --------------------------------------------------------------------------------- |
| template_id | String | (required) Template id from [Query proposal templates](#query-proposal-templates) |
| drawing_id  | String | (required) Drawing id                                                             |

<aside class="notice">
The returned url will expire in 24 hours.
</aside>
