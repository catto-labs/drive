# Drive, a cattolabs alternative

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

### Where to find the API token ?

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

## Run locally

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev --open
```
