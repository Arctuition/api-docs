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

## Query Proposals

```shell
curl "https://api.arcsite.com/extapi/v1/proposals" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
[
  {
    "proposal_id": "123",
    "project_id": "456",
    "name": "Main Building Proposal",
    "status": "APPROVED",
    "sales_representative": "John Doe",
    "contact_email": "john@example.com",
    "customer_name": "Jane Smith",
    "customer_email": "jane@example.com",
    "document_number": "PROP-2024-001",
    "total": 15000.0,
    "pdf_url": "https://d1umxpetlubu85.cloudfront.net/36029346774973628/36029621653386370/36029621653386685/c6f62f3d-db06-42df-8138-91d80e792e5d/Drawing_1_Pre-Survey_Proposal_-281-29-page_03_test-page_02_test.pdf",
    "approved_option": {
      "id": "789",
      "drawing_id": "abc123def456"
    }
  }
]
```

Returns a list of proposals of your organization. You can filter by project and paginate; proposals are sorted by most recent activity first.

### HTTP Request

`GET https://api.arcsite.com/extapi/v1/proposals`

### Query Parameters

| Parameter  | Default | In    | Description                                |
| ---------- | ------- | ----- | ------------------------------------------ |
| project_id | -       | query | (optional) Project ID to filter proposals. |
| page       | 1       | query | (optional) Request a specific page.        |
| per_page   | 10      | query | (optional) Page size.                      |

### Proposal

Each item in the response array is a `Proposal` object with the following fields. Some fields are returned only for specific statuses.

| Parameter            | Type           | Description                                                                          |
| -------------------- | -------------- | ------------------------------------------------------------------------------------ |
| proposal_id          | String         | Proposal ID                                                                          |
| project_id           | String         | Project ID the proposal belongs to                                                   |
| name                 | String         | Proposal name                                                                        |
| status               | String         | Proposal status (DRAFT/PENDING/VOID/LOST/APPROVED).                                  |
| sales_representative | String         | Name of the sales representative                                                     |
| contact_email        | String         | Email of the sales representative                                                    |
| customer_name        | String         | Customer name                                                                        |
| customer_email       | String         | Customer email                                                                       |
| document_number      | String         | Proposal document number                                                             |
| close_note           | String         | (optional) Reason for closing the proposal. Present when status is `VOID` or `LOST`. |
| total                | Number         | (optional) Total amount of the proposal. Present when status is `APPROVED`.          |
| pdf_url              | String         | (optional) URL of the proposal PDF file. Present when status is `APPROVED`.          |
| approved_option      | ApprovedOption | (optional) Approved option information. Present when status is `APPROVED`.           |

### ApprovedOption

| Parameter  | Type   | Description                            |
| ---------- | ------ | -------------------------------------- |
| id         | String | (optional) Only for online approvals.  |
| drawing_id | String | ID of the associated drawing resource. |

<aside class="notice">
The status field is an enum with the following values:
<ul>
  <li><code>DRAFT</code>: When a new proposal is created</li>
  <li><code>PENDING</code>: When a proposal is sent to the customer</li>
  <li><code>VOID</code>: When a proposal is marked as void</li>
  <li><code>LOST</code>: When a proposal is marked as lost</li>
  <li><code>APPROVED</code>: When a proposal is approved or e-signed</li>
</ul>
</aside>

<aside class='notice'>
  The <code>pdf_url</code> field is typically a time-limited URL for 24 hours. You should download the PDF soon after retrieving it.
</aside>

## Export Proposal PDF

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

Export Proposal PDF by giving the proposal template id.

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
