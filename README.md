<h3 align="center">
	<img src="https://github.com/catto-labs/drive/blob/main/src/assets/icon/logo.png?raw=true" width="100" alt="Logo"/><br/>
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
	Drive by catto labs
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
Drive - a versatile file-sharing platform inspired by Google Drive and WeTransfer. With a range of sharing options, including anonymous uploads and easy file sharing, Drive empowers users to collaborate and exchange files effortlessly. Experience the freedom of anonymous sharing with Drive.
</p>

## Table of Contents
Buckle up your seatbelt, this'll be a long one.

- [Tech Stack](#tech-stack)
- [Demo Videos](#demo-videos)
- [Using the API](#using-the-api)
  - [Differences between anonymous and authenticated users on the API](#differences-between-anonymous-and-authenticated-users-on-the-api)
  - [Where do I find the API token?](#where-do-i-find-the-api-token)
  - [Get a workspace ID](#get-a-workspace-id)
  - [Integration with ShareX](#integration-with-sharex)
    - [Manual](#manual)
    - [Pre-made: Anonymously upload public files](#pre-made-anonymously-upload-public-files)
  - [Integration with cURL](#integration-with-curl)
    - [Upload as anonymous](#upload-as-anonymous)
    - [Upload as authenticated to a certain workspace](#upload-as-authenticated-to-a-certain-workspace)
- [Meet The Team](#meet-the-team)
- [Project setup and development](#project-setup-and-development)
  - [Recommended IDE Setup:](#recommended-ide-setup)
  - [Development setup:](#development-setup)


## Tech Stack
The main tech stack is Solid JS with Solid Start using TypeScript, UnoCSS, Kobalte UI and (of course, being the most essential for this hackathon) Supabase with the v2 JavaScript SDK.

Features of Supabase have been utilized as follows:

* Authentication: Made a full user system with email + OAuth login.
* Database: Used to store all information necessary for the users, such as uploads, workspaces, and profiles themselves.
* Edge Functions: Used to handle all upload tasks to Supabase storage.
* Storage: Used to store all user uploaded files.

This usage is covering all major feature areas of Supabase, and many of these features like the database, edge functions and storage are heavily used across the product.

## Demo Videos

### Upload as anonymous through the homepage

[![Watch the video](https://drive.cattolabs.com/api/file/360ba0a3-f090-46b8-b528-f2159974187a)](https://drive.cattolabs.com/api/file/360ba0a3-f090-46b8-b528-f2159974187a)

### Upload as anonymous through ShareX

[![Watch the video](https://drive.cattolabs.com/api/file/8b03b8c8-5535-43c4-b82b-cf4112348c3b)](https://drive.cattolabs.com/api/file/8b03b8c8-5535-43c4-b82b-cf4112348c3b)

### Upload as authenticated through dashboard and make it public

[![Watch the video](https://drive.cattolabs.com/api/file/494e4ef0-15fd-4a27-b658-511e16e20e75)](https://drive.cattolabs.com/api/file/494e4ef0-15fd-4a27-b658-511e16e20e75)

### Upload as authenticated through ShareX
[![Watch the video](https://drive.cattolabs.com/api/file/828297ac-85bd-4948-8b15-10856d663789)](https://drive.cattolabs.com/api/file/828297ac-85bd-4948-8b15-10856d663789)

### Upload as authenticated through cURL
[![Watch the video](https://drive.cattolabs.com/api/file/65df2d5f-394b-43e1-87f5-063e00c341a0)](https://drive.cattolabs.com/api/file/65df2d5f-394b-43e1-87f5-063e00c341a0)

## Using the API

> Available @ <https://drive.cattolabs.com/api>

We provide an accessible API for interacting with the drive. In fact, we use that exact same API in the front-end of the web app.

You can use the API as unauthenticated (anonymous) or [authenticated](#how-to-authenticate).

### Differences between anonymous and authenticated users on the API

|     | Unauthenticated | Authenticated |
| --- | --------------- | ------------- |
| Upload files | ✅ Yes | ✅ Yes |
| Access public files | ✅ Yes | ✅ Yes |
| Upload files in a workspace | ❌ No | ✅ Yes |
| Create workspaces | ❌ No | ✅ Yes |
| Remove uploaded file later - with no self destruct option | ❌ No | ✅ Yes |
| Access private files - if user is allowed | ❌ No | ✅ Yes |

### Where do I find the API token?

If you do have an account, head over the "My Account" page and
grab your "API Token" from there.

### Get a workspace ID

> TODO

### Integration with [ShareX](https://getsharex.com/)

[ShareX](https://getsharex.com/) is a screen capture, file sharing app. Using our API, you can easily upload your files in your workspace.

To use [drive.cattolabs.com](https://drive.cattolabs.com) with ShareX, you have to setup a custom uploader.

Head over to "Destinations" > "Custom uploader settings" ;

From here, you can either [create a new custom uploader manually](#manual) or simply use a pre-made one we give you: [anonymous upload](#pre-made-anonymously-upload-public-files).

#### Manual

- Click on "New" to create a new uploader. Name it as you want, we'll go with `drive.cattolabs.com` here ;
- Set the "Destination type" to `Image uploader` and `File uploader`, we currently don't support `Text uploader` ;
- Set the "Method" to `PUT` ;
- Set the "Request URL" to `https://kcpxeoxkmblpivpgwdsm.supabase.co/functions/v1/upload-file`, (for some reason, ShareX throws an error on redirection so `https://drive.cattolabs.com/api/workspace/upload` doesn't work) ;
- Keep "URL parameters" empty ;
- For "Headers", leave empty ;
- Keep "Body" as `Form data (multipart/form-data)`, below you're able to add form data parameters

> `private` as name and `0` as value to make all your uploaded files public. If you're authenticated to an account, the default value will be `1` and `0` if you're anonymous.
> If you want to upload to an account, pass the `api_token` parameter followed by the value of the [account's API token](#where-to-find-the-api-token).
> By default, uploaded files will be in the root workspace of the account.
> You can override that behavior by adding `workspace_id` as name and [any workspace ID](#get-a-workspace-id) as value to make the upload go there.

- Set the "File form name" to `files` ;
- Set the "URL" to `https://drive.cattolabs.com/api/file/{json:data.uploaded[0].id}`
- Set the "Error message" to `{json:message}`

#### Pre-made: Anonymously upload public files

```json
{
  "Version": "15.0.0",
  "Name": "drive.cattolabs.com",
  "DestinationType": "ImageUploader, FileUploader",
  "RequestMethod": "PUT",
  "RequestURL": "https://kcpxeoxkmblpivpgwdsm.supabase.co/functions/v1/upload-file",
  "Body": "MultipartFormData",
  "Arguments": {
    "private": "0"
  },
  "FileFormName": "files",
  "URL": "https://drive.cattolabs.com/api/file/{json:data.uploaded[0].id}",
  "ErrorMessage": "{json:message}"
}
```

### Integration with cURL

You can simply send files through your terminal using cURL.

In these examples, let's say you want to upload two files located at `./screen1.png` and `/tmp/image.jpg`.

#### Upload as anonymous

```bash
curl -L \
  -X PUT \
  -F 'files=@screen1.png' \
  -F 'files=@/tmp/image.jpg' \
  https://drive.cattolabs.com/api/workspace/upload
```

#### Upload as authenticated to a certain workspace

```bash
curl -L \
  -X PUT \
  -F "api_token=YOUR_API_TOKEN" \
  -F 'workspace_id=SOME-WORKSPACE-ID-123456789' \
  -F 'private=0' \
  -F 'files=@screen1.png' \
  -F 'files=@/tmp/image.jpg' \
  https://drive.cattolabs.com/api/workspace/upload
```

If you want to upload to your root workspace, you can remove the `workspace_id`
parameter, it'll take the root workspace by default.
`workspace_id` can be found using [this guide](#get-a-workspace-id).

`private` defaults to `1` if not passed. If you want to make publicly
accessible uploads, you might have to change it to `private=0`.

## Meet The Team
- [@Vexcited](https://github.com/vexcited): full stack developer (insanely productive, carried the project (as always) 😂 ♥)
- [@pnxl](https://github.com/pnxl): front-end developer, ui/ux designer
- [@trobonox](https://github.com/trobonox): creator of initial concept/idea, project manager (leading development, setting priorities and goals), full stack developer (mostly front-end)

## Project setup and development
### Recommended IDE Setup:
[Visual Studio Code](https://code.visualstudio.com/), with:
- [UnoCSS Intellisense](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Development setup:
Prerequisites: 

- Populate the .env file with the secrets from Supabase Studio (see .env.example for the file format)
- Install needed dependencies using `pnpm install`
- Fix code style issues using `pnpm lint`

For development with a local preview and hot reloading, running a development server is done using the `pnpm dev` command.
To build for production, use the `pnpm build` command.

---

Copyright (c) 2023 catto labs

Licensed under the MIT license.
