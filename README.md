[![Build and Test](https://github.com/GeneralMills/sendgrid-send-email-action/actions/workflows/test.yml/badge.svg)](https://github.com/GeneralMills/sendgrid-send-email-action/actions/workflows/test.yml)

# Twilio SendGrid Send Email Action

A GitHub action that helps to send email using Twilio SendGrid API.

## Project Setup

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action

## Inputs

| Parameter           | Required | Info                                                                          |
| --------------------| -------- | ------------------------------------------------------------------------------|
| `emailToAddresses`  | `true`   | The receivers to whom email will be sent, seperated by the comma (,) character|
| `emailFromAddress`  | `true`   | The email address that will be shown as sender                                |
| `emailBodyHtml`     | `true`   | The body of the mail as HTML                                                  |
| `sendGridApiKey`    | `true`   | The SendGrid API Key for authentication                                       |
| `emailSubject`      | `false`  | The subject of the email                                                      |
| `emailBodyText`     | `false`  | The body of the mail as Plain Text                                            |
| `attachmentsPath`   | `false`  | Email single attachment path, with it's file name, already created on the runner host. For e.g. ./attachment.pdf. Ensure that the file encoding is UTF8. The total email message size should not exceed 20MB. This includes the message itself, headers, and the combined size of any attachments.|
| `attachmentMimeType`| `false`  | Email single attachment HTTP MIME type. For e.g. application/pdf. Refer https://www.iana.org/assignments/media-types/media-types.xhtml#application for more details.|

## Example

One of the example:-

```yaml
uses: GeneralMills/artifactory-push-docker-image-action@v1.0.0
with:
  emailToAddresses: 'person1@abc.com, person2@abc.com'
  emailFromAddress: 'noreply@github.com'
  emailSubject: 'TESTING - GitHub Send Email Action'
  emailBodyHtml: '<p>This is test email to check the working of GitHub Send Email Action</p>'
  sendGridApiKey: ${{ secrets.SENDGRID_API_KEY }}
  attachmentsPath: ./test-email.txt
  attachmentMimeType: plain/text
```