---
title: Webhooks
description: Use webhooks to get real-time notifications when events happen in your ArcSite organization.
---

Use webhooks to get real-time updates.

ArcSite uses webhooks to notify your application when an event happens in your organization. Webhooks are particularly useful for asynchronous events such as a new drawing being created.

A webhook enables ArcSite to push real-time notifications to your app. ArcSite sends these notifications to your app as a JSON payload in an HTTP `POST` request. You can then use these notifications to execute actions in your backend systems.

You can create and manage your webhooks in the ArcSite web app under **Admin → Developers → [Webhooks](https://user.arcsiteapp.com/admin/webhooks)**. Only organization owners and admins can manage webhooks.

Webhook URLs should use `https://` (plain `http://` is also accepted), can be at most 255 characters, and must resolve to a public internet address: private-network, loopback and link-local addresses are rejected. You can include basic-auth credentials in the URL (`https://user:pass@example.com/hook`).

Each webhook payload contains the _event type_ and the _payload data_.

```json title="Event payload"
{
  "event": "project.created",
  "data": {
    "id": "36029621652695040",
    "name": "project 4",
    "created_at": "2022-01-16T04:19:23.000000Z",
    "updated_at": "2022-01-16T04:19:23.000000Z",
    "archived": false,
    "job_number": "144111",
    "customer": {
      "name": "Jack",
      "phone": "1441",
      "second_phone": "1122",
      "email": "customer@example.com",
      "second_email": null,
      "address": {
        "street": "street",
        "city": "city",
        "county": "county",
        "state": "state",
        "zip_code": "300433"
      }
    },
    "work_site_address": null,
    "sales_rep": {
      "name": "Wang",
      "email": "sales@example.com",
      "phone": "122122-121"
    },
    "tags": ["tag1", "tag2"]
  }
}
```

## Events

| Event                                                        | Description                                                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [`project.created`](#project-created)                        | Triggered when a project is created.                                                         |
| [`project.updated`](#project-updated)                        | Triggered when a project's own data is modified, such as renaming, descriptions, or tags.   |
| [`drawing.created`](#drawing-created)                        | Triggered when a drawing is created by uploading PDF files (on the web or with the Import PDF API) or uploading a new drawing. |
| [`drawing.updated`](#drawing-updated)                        | Triggered when a drawing is manually re-uploaded to the cloud after its initial creation.    |
| [`proposal.signed`](#proposal-pdf-signeddeprecated)          | Triggered when a proposal is signed in the app. (Deprecated)                                 |
| [`proposal.sent`](#proposal-sentdeprecated)                  | Triggered when a proposal is sent to customer. (Deprecated)                                  |
| [`proposal.approved`](#proposal-approveddeprecated)          | Triggered when a proposal is approved by customer. (Deprecated)                              |
| [`proposal.status_changed`](#proposal-status-changed)        | Triggered when a proposal status changes.                                                    |
| [`proposal.viewed`](#proposal-viewed)                        | Triggered the first time a customer opens an online proposal.                                |
| [`proposal.payment.received`](#proposal-payment-received)    | Triggered when a payment is successfully received for a proposal.                            |
| `app_export_proposal.prompted`                               | Triggered after a proposal PDF is exported in the ArcSite App and the user answers the push prompt. Available only when your organization is connected to a supported integration; see [Integrations](/integrations/). |

## Delivery and retries

ArcSite sends each event as an HTTP `POST` with `Content-Type: application/json`. A delivery succeeds when your endpoint returns a 2xx response status code within 30 seconds (the connection must be accepted within 5 seconds). Any other result, such as a non-2xx status code, a timeout or a connection error, counts as a failure, and ArcSite retries the event.

ArcSite follows up to 5 redirects (`301`, `302`, `303`, `307`, `308`), as long as every hop resolves to a public internet address. After a `307` or `308` it repeats the `POST` with the same body; after a `301`, `302` or `303` it follows with a `GET` without a body. The response at the end of the redirects decides whether the delivery succeeded.

ArcSite makes up to 7 attempts per event: the first delivery and 6 retries, sent 15 seconds, 30 seconds, 3 minutes, 10 minutes, 20 minutes and 30 minutes after the previous failed attempt. If the last attempt fails, about 64 minutes after the first, ArcSite stops retrying the event. If your endpoint responds with `410 Gone`, ArcSite stops retrying that event right away. The webhook itself stays enabled.

Every retry sends the same request body as the first attempt. The body holds the data as it was when ArcSite generated the payload, shortly after the event, so it can already include changes made after the event. The `ArcSite-Signature` header has a new timestamp and signature on each attempt.

:::note
Webhooks are delivered at least once, so your endpoint can receive the same event more than once, for example when it takes longer than 30 seconds to respond. Events can also arrive out of order. Deliveries do not carry a unique delivery ID, so make sure your handler can safely process the same event twice.
:::

## Secure your endpoint

We highly recommend you secure your integration by ensuring your handler verifies that all webhook request are generated by ArcSite.

The following section describes how to verify webhook signatures:

- Retrieve your endpoint’s secret.
- Verify the signature.

**Retrieving your endpoint’s secret**

Use the [ArcSite Webhooks web UI](https://user.arcsiteapp.com/admin/webhooks) to get the webhook secret. ArcSite generates a unique secret key for each webhook.

![Webhooks](/images/webhooks/webhooks_list.png)

```json title="Sample webhook header"
{
  "ArcSite-Signature": "t=1716975491,v=5f43f28c3d33c34b18634399a8e3bb69dcfb9f146cea562289306d783187d0f1"
}
```

**Verifying the signature**

To verify the signature, you need to compare the signature in the header of the incoming webhook request with the signature using the secret and the request body.
The `ArcSite-Signature` header included in each signed event contains a timestamp and signature that you must verify. The timestamp is prefixed by `t=`, and the signature is prefixed by a `v=`.

```python
import hmac
import hashlib
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


SECRET = 'your_webhook_secret'


def verify_webhook(header, payload, secret):
    if not header:
        return False
    # Extract timestamp and signature
    elements = dict(item.split('=', 1) for item in header.split(','))
    timestamp, signature = elements['t'], elements['v']
    # Prepare signed payload string
    signed_payload = f"{timestamp}.{payload}"
    # Compute expected signature
    expected_signature = hmac.new(secret.encode(), signed_payload.encode(), hashlib.sha256).hexdigest()
    # Verify signature
    return hmac.compare_digest(signature, expected_signature)


# Django Example
@csrf_exempt
def webhook_handler(request):
    if request.method == 'POST':
        header = request.headers.get('ArcSite-Signature')
        payload = request.body.decode('utf-8')
        if not verify_webhook(header, payload, SECRET):
            return HttpResponse('Invalid signature or timestamp.', status=400)
        # TODO Process the valid webhook payload here
        return HttpResponse('Webhook received successfully.', status=200)
    return HttpResponse('Method not allowed.', status=405)

```

**Step 1: Extract the timestamp and signature from the header**

Split the header using the `,` character as the separator to get a list of elements. Then split each element using the `=` character as the separator to get a prefix and value pair.
The value for the prefix `t` corresponds to the timestamp and the prefix `v` to the signature. You can discard all other elements.

**Step 2: Prepare the `signed_payload` string**

The `signed_payload` string is created by concatenating:

- The timestamp (as a string)
- The character `.`
- The actual JSON payload (that is, the request body)

**Step 3: Determine the expected signature**

Compute an HMAC with the SHA256 hash function. Use the webhook’s secret as the key, and use the `signed_payload` string as the message.

**Step 4: Compare the signature**

Compare the signature in the header to the expected signature.

```js
const express = require("express");
const crypto = require("crypto");

const app = express();
const SECRET = "your_webhook_secret";

app.use(express.raw({ type: "*/*" }));

function verifyWebhook(header, payload, secret) {
  // Extract timestamp and signature
  const elements = header.split(",").reduce((acc, element) => {
    const [key, value] = element.split("=");
    acc[key] = value;
    return acc;
  }, {});
  const signature = elements["v"];
  // Prepare signed payload string
  const signedPayload = `${elements["t"]}.${payload}`;
  // Compute expected signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");
  // Verify signature
  if (!signature || signature.length !== expectedSignature.length) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

app.post("/webhook", (req, res) => {
  const header = req.headers["arcsite-signature"];
  const payload = req.body.toString("utf-8");
  if (!verifyWebhook(header, payload, SECRET)) {
    return res.status(400).send("Invalid signature.");
  }
  // TODO Process the valid webhook payload here
  res.status(200).send("Webhook received successfully.");
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
```

## Project Created

`project.created` Triggered when a project is created.

### Project Created Webhook Payload

| Parameter          | Type               | Description                         |
| ------------------ | ------------------ | ----------------------------------- |
| id                 | String             | ID of the project                   |
| name               | String             | Name of the project                 |
| created_at         | String             | Creation time (ISO 8601, UTC, e.g. `2022-01-16T04:19:23.000000Z`) |
| updated_at         | String             | Last update time (ISO 8601, UTC)    |
| archived           | Boolean            | Whether the project is archived     |
| customer           | [Customer](/projects/#customer) \| null | Customer profile of the project     |
| job_number         | String \| null     | Job number of the project           |
| work_site_address  | [Address](/projects/#address) \| null | Worksite address of the project     |
| sales_rep          | [SalesRep](/projects/#salesrep) \| null | Sales Representative of the project |
| tags               | List[String]       | Tags attached to the project        |

## Project Updated

`project.updated` Triggered when a project's own data is modified, including:

- Renaming the project, or updating its description / display name / client profile.
- Adding or removing a tag on the project, or removing a tag definition that was attached to the project.

It is sent for every successful update request, even one that changes nothing. Archiving or unarchiving a project does not trigger it.


### Project Updated Webhook Payload

The payload schema matches `project.created`, with the additional `source` field.

| Parameter          | Type               | Description                         |
| ------------------ | ------------------ | ----------------------------------- |
| id                 | String             | ID of the project                   |
| name               | String             | Name of the project                 |
| created_at         | String             | Creation time (ISO 8601, UTC, e.g. `2022-01-16T04:19:23.000000Z`) |
| updated_at         | String             | Last update time (ISO 8601, UTC)    |
| archived           | Boolean            | Whether the project is archived     |
| customer           | [Customer](/projects/#customer) \| null | Customer profile of the project     |
| job_number         | String \| null     | Job number of the project           |
| work_site_address  | [Address](/projects/#address) \| null | Worksite address of the project     |
| sales_rep          | [SalesRep](/projects/#salesrep) \| null | Sales Representative of the project |
| tags               | List[String]       | Tags attached to the project        |
| source             | String \| null      | Origin of the update: `app` for the ArcSite App, `web` for the ArcSite web UI, `open_api` for the ArcSite Open API, or `null` when unavailable (such as a system-initiated update) |

:::note
The `source` field is available only on `project.updated` webhook payloads. Other webhook event payloads are unchanged.
:::

## Drawing Created

The `drawing.created` webhook will be triggered when a drawing is created by uploading PDF files on the user site or with the [Import PDF](/projects/#import-pdf) API, or by manually uploading some newly created drawing to the cloud from the ArcSite App.

:::note
The returned `pdf_url` or `png_url` will expire 24 hours after ArcSite generates the payload. They are not permanent links and should not be used in your system directly. You need to download the files from the urls for your future use.

For drawing created from the user site by uploading PDF files, the `png_url` will be an empty string (`""`). `pdf_url` and `dxf_url` are `null` when the drawing has no PDF or DXF file.
:::

### Drawing Created Webhook Payload

| Parameter  | Type         | Description                                   |
| ---------- | ------------ | --------------------------------------------- |
| id         | String       | ID of the drawing                             |
| project_id | String       | Project ID of the drawing                     |
| name       | String       | Name of the drawing                           |
| pdf_url    | String \| null | Download address of PDF format of the drawing |
| png_url    | String       | Download address of PNG format of the drawing (empty string if there is none) |
| dxf_url    | String \| null | Download address of DXF format of the drawing |
| tags       | List[String] | Tags added to this drawing                    |

## Drawing Updated

The `drawing.updated` webhook is triggered whenever a drawing is manually re-uploaded to the cloud from the ArcSite App after its initial creation.

:::note
The returned `pdf_url` or `png_url` will expire 24 hours after ArcSite generates the payload. They are not permanent links and should not be used in your system directly. You need to download the files from the urls for your future use.
:::

### Drawing Updated Webhook Payload

| Parameter  | Type         | Description                                   |
| ---------- | ------------ | --------------------------------------------- |
| id         | String       | ID of the drawing                             |
| project_id | String       | Project ID of the drawing                     |
| name       | String       | Name of the drawing                           |
| pdf_url    | String \| null | Download address of PDF format of the drawing |
| png_url    | String       | Download address of PNG format of the drawing (empty string if there is none) |
| dxf_url    | String \| null | Download address of DXF format of the drawing |
| tags       | List[String] | Tags added to this drawing                    |

## Proposal PDF Signed(Deprecated)

`proposal.signed` Triggered when a proposal is signed in the app.

:::note
The returned `url` will expire 24 hours after ArcSite generates the payload. It's not a permanent link and should not be used in your system directly. You need to download the file from the url for your future use.
:::

### Proposal PDF signed Webhook Payload

| Parameter          | Type   | Description                                         |
| ------------------ | ------ | --------------------------------------------------- |
| project_id         | String | Project ID of the drawing                           |
| name               | String | File name of the signed document                    |
| url                | String | Download address of the signed pdf                  |
| drawing_id         | String | The associated drawing id of the signed pdf         |
| drawing_version_id | String | The associated drawing version id of the signed pdf |

## Proposal Sent(Deprecated)

`proposal.sent` Triggered when a proposal is sent to customer.

:::note
A proposal option is associated with a specific drawing version in Arcsite. If you need to get the line items data of the specified drawing version, you can use the `drawing_version_id` of the option in the Get line items API.
:::

:::note
The returned `url` in proposal options will expire 24 hours after ArcSite generates the payload. It's not a permanent link and should not be used in your system directly. You need to download the file from the url for your future use.
:::

### Proposal Sent Webhook Payload

| Parameter            | Type                 | Description                          |
| -------------------- | -------------------- | ------------------------------------ |
| project_id           | String               | Approved proposal related project ID |
| proposal_id          | String               | Proposal ID                          |
| name                 | String               | Proposal name                        |
| customer_name        | String               | Proposal customer name               |
| contact_email        | String               | The sales email                      |
| sales_representative | String               | The sales name                       |
| proposal_options     | List[ProposalOption] | The proposal option data list        |

### ProposalOption

| Parameter          | Type   | Description                                       |
| ------------------ | ------ | ------------------------------------------------- |
| id                 | String | Proposal option ID                                |
| name               | String | Proposal option name                              |
| drawing_id         | String | The proposal option associated drawing ID         |
| drawing_version_id | String | The proposal option associated drawing version ID |
| total              | Number | The total of the proposal option                  |
| pdf_url            | String | Download address of the proposal option pdf file  |

## Proposal Approved(Deprecated)

`proposal.approved` Triggered when a proposal is approved by customer.

### Proposal Approved Webhook Payload

| Parameter            | Type                   | Description                          |
| -------------------- | ---------------------- | ------------------------------------ |
| project_id           | String                 | Approved proposal related project ID |
| proposal_id          | String                 | Proposal ID                          |
| name                 | String                 | Proposal name                        |
| customer_name        | String                 | Proposal customer name               |
| contact_email        | String                 | The sales email                      |
| sales_representative | String                 | The sales name                       |
| customer_email       | String \| null         | Proposal customer email              |
| customer_address     | [Address](/projects/#address) | Customer address of the project |
| approved_option      | ApprovedProposalOption | Approved proposal option data        |
| initial_proposal_id  | String                 | (optional) ID of the first proposal in the change-order chain |

### ApprovedProposalOption

| Parameter          | Type   | Description                                       |
| ------------------ | ------ | ------------------------------------------------- |
| name               | String | Approved proposal option name                    |
| drawing_id         | String | Associated drawing ID                            |
| drawing_version_id | String | Associated drawing version ID                    |
| total              | Number | Total amount of the approved option              |
| pdf_url            | String | Download address of the approved proposal PDF    |

The deprecated `proposal.approved` event does not include an option `id` in `approved_option`. The `pdf_url` expires 24 hours after ArcSite generates the payload.

## Proposal Status Changed

`proposal.status_changed` Triggered when a proposal status changes.

It isn't sent for status changes caused by payments (use [`proposal.payment.received`](#proposal-payment-received)), when the customer e-signs a proposal that still needs the sales representative's signature, or when an expired proposal is reopened by setting a new expiration date.

### Proposal Status Change Webhook Payload

| Parameter            | Type                 | Description                                                                                                                                          |
| -------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| proposal_id          | String               | Proposal ID                                                                                                                                          |
| project_id           | String               | Proposal related project ID                                                                                                                          |
| name                 | String               | Proposal name                                                                                                                                        |
| status               | String               | Proposal status. See the enum below.                                                                                                                  |
| sales_representative | String               | The sales name                                                                                                                                       |
| contact_email        | String               | The sales email                                                                                                                                      |
| customer_name        | String               | Proposal customer name                                                                                                                               |
| customer_email       | String \| null       | Proposal customer email                                                                                                                              |
| document_number      | String               | (optional) Proposal document number                                                                                                                  |
| close_note           | String               | (optional) Note explaining why proposal was closed (Only present when status is VOID or LOST)                                                         |
| total                | Number               | (optional) The total of the proposal (Only present when status is APPROVED, PARTIALLY_PAID, PAID or OVER_PAID). For a change order, this is the full revised amount; see [Change Orders](/proposals/#change-orders) |
| pdf_url              | String               | (optional) Download link to the proposal PDF file. Only present when status is APPROVED, PARTIALLY_PAID, PAID or OVER_PAID. Contains the signed version if the proposal has been signed. Expires 24 hours after ArcSite generates the payload |
| approved_option      | Object               | (optional) Contains `drawing_id` (String); online approvals also include `id` (String) and `drawing_version_id` (String). Only present when status is APPROVED, PARTIALLY_PAID, PAID or OVER_PAID |
| initial_proposal_id  | String               | (optional) ID of the first proposal in the change-order chain. Present on every proposal in a chain, including the original proposal, where it equals `proposal_id` |
| proposal_options     | List[ProposalOption] | (optional) Full list of proposal options for online proposals. Included whenever proposal status changes.                                            |
| template_id          | String \| null | The ID of the template used to create the proposal. Returns `null` when the proposal is signed in app.                           |

:::note
The status field is an enum with the following values:
<ul>
  <li>`DRAFT`: When a new proposal is created</li>
  <li>`PENDING`: When a proposal is sent to the customer</li>
  <li>`VOID`: When a proposal is marked as void</li>
  <li>`LOST`: When a proposal is marked as lost</li>
  <li>`APPROVED`: When a proposal is approved or e-signed, online or in the app</li>
  <li>`EXPIRED`: When a sent proposal passes its expiration date without being approved</li>
  <li>`PARTIALLY_PAID`, `PAID`, `OVER_PAID`: When a change order is approved on a proposal that already has payments recorded</li>
</ul>
:::

## Proposal Viewed

`proposal.viewed` Triggered the first time a customer opens an online proposal.

Sent once per proposal, on the first open only — later opens do not
re-trigger it. Use it to advance a deal stage or queue follow-up while the customer is still
looking at the bid. Sales previews and sign-in-person sessions do not trigger this event, and a proposal that was signed in person does not send it later.

:::note
A change order is a separate proposal, so opening one sends its own `proposal.viewed` with the
same `project_id` but a different `proposal_id`. Key your automation off `proposal_id`, and use
`initial_proposal_id` to tie the change order back to the original proposal.
:::

```json title="Example"
{
  "event": "proposal.viewed",
  "data": {
    "proposal_id": "1234567890",
    "project_id": "9876543210",
    "name": "Backyard Fence",
    "viewed_at": "2026-07-30T10:00:00.123456Z",
    "status": "PENDING",
    "sales_representative": "Jane Smith",
    "contact_email": "jane@example.com",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "document_number": "P-0001",
    "template_id": "2468013579"
  }
}
```

### Proposal Viewed Webhook Payload

| Parameter            | Type    | Description                                                                                                     |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| proposal_id          | String  | Proposal ID                                                                                                     |
| project_id           | String  | Proposal related project ID                                                                                     |
| name                 | String  | Proposal name                                                                                                   |
| viewed_at            | String  | When the customer first opened the proposal (ISO 8601, UTC)                                                     |
| status               | String  | Proposal status when the webhook payload is generated; it may have changed since the first view                 |
| sales_representative | String  | The sales name                                                                                                  |
| contact_email        | String  | The sales email                                                                                                 |
| customer_name        | String  | Proposal customer name                                                                                          |
| customer_email       | String \| null | Proposal customer email                                                                                  |
| document_number      | String  | (optional) Proposal document number                                                                             |
| initial_proposal_id  | String  | (optional) ID of the first proposal in the change-order chain. Present on every proposal in a chain, including the original proposal, where it equals `proposal_id` |
| template_id          | String  | The ID of the template used to create the online proposal.                                                      |

`close_note`, `total`, `pdf_url` and `approved_option` are also included under the same conditions as in [`proposal.status_changed`](#proposal-status-changed).


## Proposal Payment Received

`proposal.payment.received` Triggered when a payment is successfully received for a proposal.

This webhook fires for both ArcSite Payment and Mark as Paid (manual payment recording). The webhook is triggered once per payment transaction.

```json title="ArcSite Payment Example"
{
  "event": "proposal.payment.received",
  "data": {
    "proposal_id": "12345",
    "paid_amount": 5000.0,
    "pay_channel": "arcsite_payment",
    "paid_time": "2025-11-06T10:30:00",
    "drawing_id": "22444",
    "payment_method": "Credit Card"
  }
}
```

```json title="Mark as Paid Example (manual payment recording)"
{
  "event": "proposal.payment.received",
  "data": {
    "proposal_id": "12345",
    "paid_amount": 2500.0,
    "pay_channel": "mark_as_paid",
    "paid_date": "2025-11-06",
    "drawing_id": "22444",
    "payment_method": "Check"
  }
}
```

### Proposal Payment Received Webhook Payload

| Parameter      | Type   | Description                                                                                                       |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| proposal_id    | String | ID of the proposal that received the payment                                                                      |
| drawing_id     | String | The approved drawing id of the proposal                                                                           |
| paid_amount    | Number | Amount of this specific payment (not cumulative). Decimal with 2 decimal places                                   |
| pay_channel    | String | Payment channel identifier: `arcsite_payment` (online payment) or `mark_as_paid` (manual recording)               |
| paid_time      | String | (conditional) Timestamp (UTC) when payment was received, in ISO 8601 format without a timezone designator (e.g. `2025-11-06T10:30:00`). Only present when `pay_channel` is `arcsite_payment` |
| paid_date      | String | (conditional) Date when payment was recorded. Only present when `pay_channel` is `mark_as_paid`. ISO 8601 date    |
| payment_method | String | Payment method: `Credit Card`, `ACH`, `Check`, `Cash`, `Wire` or `Other`                                          |

:::note
The time field in the payload depends on the `pay_channel`:
<ul>
  <li>When `pay_channel` is `arcsite_payment`, the `paid_time` field contains the precise datetime of payment in ISO 8601 format</li>
  <li>When `pay_channel` is `mark_as_paid`, the `paid_date` field contains only the date (no time component) in ISO 8601 format</li>
</ul>
Check the `pay_channel` field to determine which time field to use.
:::

:::note
<strong>Important Notes:</strong>
<ul>
  <li>The `paid_amount` represents the amount of <strong>this specific payment</strong>, not the cumulative total paid for the proposal</li>
  <li>If a proposal has multiple payments, you will receive a separate webhook for each payment</li>
</ul>
:::
