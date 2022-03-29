# Projects

## Query projects

```shell
curl "https://api.arcsite.com/v1/projects" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": 36029621652695040,
    "name": "project 4",
    "created_at": "2022-01-16T04:19:23",
    "updated_at": "2022-01-16T04:19:23",
    "job_number": "144111",
    "customer": {
      "name": "Jack",
      "phone": "1441",
      "second_phone": "1122",
      "email": "c@arcsite.com",
      "second_email": "s@arcsite.com",
      "address": {
        "street": "street",
        "city": "city",
        "county": "county",
        "state": "state",
        "zip_code": "300433"
      }
    },
    "work_site_address": {
      "street": "street",
      "city": "city",
      "county": "county",
      "state": "state",
      "zip_code": "300433"
    },
    "sale_rep": {
      "name": "Wang",
      "email": "h@arcsite.com",
      "phone": "122122-121"
    }
  }
]
```

Returns a list of projects your organization. The projects are returned in sorted order, with the most recent created project appearing first.

### HTTP Request

`GET https://api.arcsite.com/v1/projects`

### Query Parameters

| Parameter | Default | In    | Description             |
| --------- | ------- | ----- | ----------------------- |
| page      | 1       | query | Request a specific page |
| per_page  | 10      | query | Page size               |

## Create Project

```shell
curl -X POST 'https://api.arcsite.com/v1/projects' \
-H 'Authorization: Bearer **your_api_token_here**' \
-H 'Content-Type: application/json' \
-d '{
    "name":"hahaa",
    "job_number": "144111",
    "customer": {
        "name": "Jack",
        "phone": "1441",
        "second_phone": "1122",
        "email": "c@arcsite.com",
        "second_email": "s@arcsite.com",
        "address": {
            "street": "street",
            "city": "city",
            "county": "county",
            "state": "state",
            "zip_code": "300433"
        }
    },
    "work_site_address": {
        "street": "street",
        "city": "city",
        "county": "county",
        "state": "state",
        "zip_code": "300433"
    },
    "sale_rep": {
        "name": "Wang",
        "email": "h@arcsite.com",
        "phone": "122122-121"
    }
}'
```

> The above command returns JSON structured like this:

```json
{
  "id": "36029621653386360",
  "name": "nac",
  "created_at": "2022-01-16T03:31:39",
  "updated_at": "2022-01-16T03:31:39",
  "job_number": "heeloo",
  "customer": {
    "name": "hello",
    "phone": "122112",
    "second_phone": "122112",
    "email": "dev@arctuition.com",
    "second_email": "dev@arctuition.com",
    "address": {
      "street": "address",
      "city": "city",
      "county": "county",
      "state": "state",
      "zip_code": "200544"
    }
  },
  "work_site_address": {
    "street": "street",
    "city": "city",
    "county": "county",
    "state": "state",
    "zip_code": "300433"
  },
  "sales_rep": {
    "name": "Wang",
    "email": "dev@arctuition.com",
    "phone": "122112"
  }
}
```

This endpoint creates a new project.

### HTTP Request

`POST https://api.arcsite.com/v1/projects`

### Parameters

| Parameter          | Type         | Description                                    |
| ------------------ | ------------ | ---------------------------------------------- |
| name               | String       | (required) Name of the project                 |
| owner              | String       | (required) Owner of the project                |
| customer           | Customer     | (optional) Customer profile of the project     |
| job_number         | String       | (optional) Job number of the project           |
| work_site_addreess | Address      | (optional) Worksite address of the project     |
| sales_rep          | SalesRep     | (optional) Sales Representative of the project |
| tags               | List[String] | (optional) Tags added to this project          |

<aside class='notice'>
<code>owner</code> must be a valid ArcSite username belongs to same organization.
</aside>

### Project Name Rule

1. Project name must be unique across the same organization.
1. Project name cannot contain any of the following characters: `:` `/` `\`.
1. Project name cannot starts with `.`
1. Project name must be less than or equal to 200 characters.

### Customer

| Parameter    | Type    | Description                         |
| ------------ | ------- | ----------------------------------- |
| name         | String  | (optional) Customer name            |
| phone        | String  | (optional) Customer phone           |
| second_phone | String  | (optional) Customer secondary phone |
| email        | String  | (optional) Customer email           |
| second_email | String  | (optional) Customer secondary email |
| address      | Address | (optional) Customer address         |

### Address

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| street    | String | (optional) Street name |
| city      | String | (optional) City name   |
| county    | String | (optional) County name |
| State     | String | (optional) State name  |
| zip_code  | String | (optional) Zip Code    |

### SaleRep

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| name      | String | (optional) Customer name  |
| email     | String | (optional) Customer email |
| phone     | String | (optional) Customer phone |

## Update Project

```shell
curl -X PATCH 'https://api.arcsite.com/v1/projects/<ID>' \
-H 'Authorization: Bearer **your_api_token_here**' \
-H 'Content-Type: application/json' \
-d '{
    "name":"hahaa",
    "job_number": "144111",
    "customer": {
        "name": "Jack",
        "phone": "1441",
        "second_phone": "1122",
        "email": "c@arcsite.com",
        "second_email": "s@arcsite.com",
        "address": {
            "street": "street",
            "city": "city",
            "county": "county",
            "state": "state",
            "zip_code": "300433"
        }
    },
    "work_site_address": {
        "street": "street",
        "city": "city",
        "county": "county",
        "state": "state",
        "zip_code": "300433"
    },
    "sale_rep": {
        "name": "Wang",
        "email": "h@arcsite.com",
        "phone": "122122-121"
    }
}'
```

This endpoint updates a project.

### HTTP Request

`PATCH https://api.arcsite.com/v1/projects/<id>`

### Parameters

| Parameter          | Type     | Description                                    |
| ------------------ | -------- | ---------------------------------------------- |
| name               | String   | (required) Name of the project                 |
| operator           | String   | (required) Who updates the project             |
| customer           | Customer | (optional) Customer profile of the project     |
| job_number         | String   | (optional) Job number of the project           |
| work_site_addreess | Address  | (optional) Worksite address of the project     |
| sales_rep          | SalesRep | (optional) Sales Representative of the project |

<aside class='notice'>
<code>operator</code> must be a valid ArcSite username belongs to same organization.
</aside>

## Get Project

```shell
curl "https://api.arcsite.com/v1/projects/<ID>" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
{
  "id": 36029621652695040,
  "name": "project 4",
  "created_at": "2022-01-16T04:19:23",
  "updated_at": "2022-01-16T04:19:23",
  "job_number": "144111",
  "customer": {
    "name": "Jack",
    "phone": "1441",
    "second_phone": "1122",
    "email": "c@arcsite.com",
    "second_email": "s@arcsite.com",
    "address": {
      "street": "street",
      "city": "city",
      "county": "county",
      "state": "state",
      "zip_code": "300433"
    }
  },
  "work_site_address": {
    "street": "street",
    "city": "city",
    "county": "county",
    "state": "state",
    "zip_code": "300433"
  },
  "sale_rep": {
    "name": "Wang",
    "email": "h@arcsite.com",
    "phone": "122122-121"
  }
}
```

Returns project of your organization by project id,

### HTTP Request

`GET https://api.arcsite.com/v1/projects/<id>`

## Add Project Collaborators

```shell
curl -X POST 'https://api.arcsite.com/v1/projects/<ID>/add_collaborators' \
-H 'Authorization: Bearer **your_api_token_here**' \
-H 'Content-Type: application/json' \
-d '{
    "collaborators": [
        {"email": "dev@arctuition.com", "role": "PROJECT_ADMIN"},
        {"email": "haowe12@arctui1tion.com", "role": "PROJECT_ADMIN"}
    ]
  }
```

This endpoint adds collaborators to a project. Successfully added collaborators are in `success_items` field of the response and failed items are in the `fail_items`. This API is idempotent, so the same collaborator can be added multiple times.

> The above command returns JSON structured like this:

```json
{
  "success_items": [
    {
      "email": "dev@arctuition.com",
      "role": "PROJECT_ADMIN"
    }
  ],
  "fail_items": [
    {
      "data": {
        "email": "haowe12@arctui1tion.com",
        "role": "PROJECT_ADMIN"
      },
      "message": "haowe12@arctui1tion.com has not been added to your company account yet."
    }
  ]
}
```

### HTTP Request

`POST https://api.arcsite.com/v1/projects/<id>/add_collaborators`

### Parameters

| Parameter     | Type                                | Description                     |
| ------------- | ----------------------------------- | ------------------------------- |
| collaborators | List[[Collaborator](#collaborator)] | (required) collaborators to add |

### Collaborator

| Parameter | Type          | Description             |
| --------- | ------------- | ----------------------- |
| email     | string        | (required)              |
| role      | [Role](#role) | (required) Project Role |

### Role

1. `PROJECT_ADMIN` - Project Admins have full access to the project.
1. `PROJECT_COLLABORATOR` - Can create, edit and delete drawings. This role cannot delete project or manage collaborators..
1. `PROJECT_VIEWER` - Project Viewers can only view drawings.

<aside class='notice'>
The collaborator' ArcSite account must be created and add to your organization before adding to the project coloaborator.
</aside>

## Get Project Drawings

```shell
curl "https://api.arcsite.com/v1/projects/<ID>/drawings" \
  -H "Authorization: Bearer **your_api_token_here**"
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": "36029621653385418",
    "name": "drawing 1"
  },
  {
    "id": "36029621653385407",
    "name": "drawing 2"
  }
]
```

Returns drawings of a project.

### HTTP Request

`GET https://api.arcsite.com/v1/projects/<id>/drawings`

### Query Parameters

| Parameter | Default | In    | Description             |
| --------- | ------- | ----- | ----------------------- |
| page      | 1       | query | Request a specific page |
| per_page  | 10      | query | Page size               |
