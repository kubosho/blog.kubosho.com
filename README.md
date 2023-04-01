# blog.kubosho.com

The source files for [blog.kubosho.com](blog.kubosho.com).

## Development

### Requirements

- Node.js
- Yarn

### How to viewing a preview in local environment

1. Run `yarn install` to download the package
2. Setup `.env` file
3. Run `yarn dev` to start the preview server

## Setup `.env`

Required write environment variables in `.env` file when fetch articles from [microCMS](https://microcms.io/).

| key | value |
| --- | --- |
| X_MICROCMS_API_KEY | Authentication key for microCMS API requests. |
| X_MICROCMS_API_SUB_DOMAIN | Sub domain of microCMS. `X_MICROCMS_API_SUB_DOMAIN` is the `<service-id>` part of `<service-id>.microcms.io`. |
| X_MICROCMS_API_NAME | API name of microCMS. `X_MICROCMS_API_NAME` is the `<endpoint>` part of `api/v1/<endpoint>`. |

`.env` Example:

```
X_MICROCMS_API_KEY=abcdefg
X_MICROCMS_API_SUB_DOMAIN=example-sub-domain
X_MICROCMS_API_NAME=api/v1/example
```
