import * as core from '@actions/core'
import * as sendgrid from '@sendgrid/mail'
import {MailDataRequired} from '@sendgrid/helpers/classes/mail'
import {EmailData} from '@sendgrid/helpers/classes/email-address'
import * as file from './file'

async function run(): Promise<void> {
  const emailToAddresses = core.getInput('emailToAddresses')
  const emailFromAddress = core.getInput('emailFromAddress')
  const emailSubject = core.getInput('emailSubject')
  const emailBodyText = core.getInput('emailBodyText')
  const emailBodyHtml = core.getInput('emailBodyHtml')
  const sendGridApiKey = core.getInput('sendGridApiKey')
  const attachmentsPath = core.getInput('attachmentsPath')
  const attachmentMimeType = core.getInput('attachmentMimeType')
  const hasAttachments = attachmentsPath !== ''

  core.debug('Getting Read to Send the Email')

  try {
    if (emailToAddresses.trim() === '') {
      throw new Error('emailToAddresses is empty')
    }

    if (emailBodyText === '' && emailBodyHtml === '') {
      throw new Error('Either text or HTML is required for email body')
    }

    if (hasAttachments && attachmentMimeType === '') {
      throw new Error(
        'attachmentMimeType is required, if attachmentsPath is provided'
      )
    } else if (
      hasAttachments &&
      !(await file.checkFileExists(attachmentsPath))
    ) {
      throw new Error(`${attachmentsPath} does not exist`)
    }

    const parsedReceivers: EmailData[] = emailToAddresses
      .split(',')
      .map(receiver =>
        receiver.replace('\n', '').replace('\r', '').replace('\t', '').trim()
      )

    const emailMessage: MailDataRequired = {
      to: parsedReceivers,
      from: emailFromAddress,
      subject: emailSubject,
      text: emailBodyText,
      html: emailBodyHtml
    }

    if (hasAttachments) {
      //currently we are supporting only single attachment
      const attachmentContent = await file.getFileContents(attachmentsPath)
      const attachmentFileName = file.parseFileName(attachmentsPath)

      emailMessage.attachments = [
        {
          content: attachmentContent,
          filename: attachmentFileName,
          type: attachmentMimeType,
          disposition: 'attachment',
          contentId: attachmentFileName
        }
      ]
    }

    sendgrid.setApiKey(sendGridApiKey)

    await sendgrid
      .sendMultiple(emailMessage as MailDataRequired)
      .then(() => {
        console.log('Successfully emailed to the recipients')
      })
      .catch(error => {
        if (error.response) {
          // Extract error msg
          const {message, code, response} = error

          core.debug(`SendGrid Error Code - ${code}`)
          core.debug(`SendGrid Error Message - ${message}`)

          // Extract response msg
          const {body} = response

          console.error(body)
          core.setFailed(body)
        }
      })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
