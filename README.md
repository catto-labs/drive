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

### How to authenticate ?

If you do have an account, head over the "My Account" page and
grab your "API Token" from there.

Now, if every requests you make to the API, just add the `Authorization` header, where its value is the API token you got from earlier.

#### Simple example using `fetch`

```typescript
const response = await fetch("https://drive.cattolabs.com/api/...", {
  // ...
  headers: {
    authorization: "api-token-you-got-here"
  }
});
```

### Get a workspace ID

> TODO

### Integration with [ShareX](https://getsharex.com/)

[ShareX](https://getsharex.com/) is a screen capture, file sharing app. Using our API, you can easily upload your files in your workspace.

To use [drive.cattolabs.com](https://drive.cattolabs.com) with ShareX, you have to setup a custom uploader.

Head over to "Destinations" > "Custom uploader settings" ;

### Manual

- Click on "New" to create a new uploader. Name it as you want, we'll go with `drive.cattolabs.com` here ;
- Set the "Destination type" to `Image uploader` and `File uploader`, we currently don't support `Text uploader` ;
- Set the "Method" to `PUT` ;
- Set the "Request URL" to `https://kcpxeoxkmblpivpgwdsm.supabase.co/functions/v1/upload-file`, (for some reason, ShareX throws on redirections so `https://drive.cattolabs.com/api/files` doesn't work) ;
- Keep "URL parameters" empty ;
- For "Headers", leave empty if you want to upload as anonymous, else add `Authorization` and as value, [your API key](#using-the-api) ;
- Keep "Body" as `Form data (multipart/form-data)`, below you're able to add form data parameters

> `private` as name and `0` as value to make all your uploaded files public.
> If you're authenticated, uploaded files will be at the root of your drive by default, you can override that behavior by adding `workspace_id` as name and [any workspace ID](#get-a-workspace-id) as value to make all uploads go there.

- Set the "File form name" to `files` ;
- Set the "URL" to `https://drive.cattolabs.com/api/file/{json:data.uploaded[0].id}`
- Set the "Error message" to `{json:message}`

### Pre-made: Anonymously upload public files

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

## Developing

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev --open
```
