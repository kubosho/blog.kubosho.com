# blog.kubosho.com

The source files for [学ぶ、考える、書き出す。](blog.kubosho.com).

*学ぶ、考える、書き出す。* is a blog build with Jamstack technology stack.

| URL                      | Status                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| https://blog.kubosho.com | [![Node.js CI](https://github.com/kubosho/blog.kubosho.com/actions/workflows/blog.yml/badge.svg)](https://github.com/kubosho/blog.kubosho.com/actions/workflows/blog.yml) |

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
| X_MICROCMS_HOST_NAME | Host name of microCMS. The format is `<service-id>.microcms.io`. |
| X_MICROCMS_API_PATH | API path of microCMS. The format is `api/v1/<endpoint>`. |

`.env` Example:

```
X_MICROCMS_API_KEY=abcdefg
X_MICROCMS_HOST_NAME=example.microcms.io
X_MICROCMS_API_PATH=api/v1/example
```
