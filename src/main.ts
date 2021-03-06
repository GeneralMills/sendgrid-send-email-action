import * as core from '@actions/core'
import sgMail from '@sendgrid/mail'
import {MailDataRequired} from '@sendgrid/helpers/classes/mail'
import {Mail} from '@sendgrid/helpers/classes'
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

  core.info('Preparing the email message')

  try {
    if (emailToAddresses.trim() === '') {
      throw new Error('emailToAddresses is empty')
    }

    if (emailBodyText.trim() === '' && emailBodyHtml.trim() === '') {
      throw new Error('Either text or HTML is required for email body')
    }

    if (hasAttachments && attachmentMimeType.trim() === '') {
      throw new Error(
        'attachmentMimeType is required, if attachmentsPath is provided'
      )
    } else if (hasAttachments && !file.checkFileExists(attachmentsPath)) {
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
      html: emailBodyHtml
    }

    if (hasAttachments) {
      //currently we are supporting only single attachment
      const attachmentFileName = file.parseFileName(attachmentsPath)
      const attachmentContent = await file.getEncodedFileContents(
        attachmentsPath
      )

      core.debug(`Attachment Filename - ${attachmentFileName}`)
      core.debug(`Attachment MimeType - ${attachmentMimeType}`)

      emailMessage.attachments = [
        {
          content: attachmentContent,
          filename: attachmentFileName,
          type: attachmentMimeType,
          disposition: 'attachment'
        }
      ]
    }

    if (emailBodyText.trim() !== '') {
      emailMessage.text = emailBodyText
    }

    core.info('Email message ready to be sent to Twilio SendGrid API')

    sgMail.setApiKey(sendGridApiKey)

    if (core.isDebug()) {
      const finalMail = Mail.create(emailMessage)
      const requestBody = finalMail.toJSON()
      core.debug(`HTTP Request Body - ${JSON.stringify(requestBody)}`)
    }

    await sgMail
      .sendMultiple(emailMessage)
      .then(() => {
        core.info('Successfully sent email message to Twilio SendGrid API')
      })
      .catch(error => {
        if (error.response) {
          const {message, code, response} = error

          core.debug(`SendGrid Error Code - ${code}`)
          core.debug(`SendGrid Error Message - ${message}`)

          const {body} = response

          core.setFailed(body)
        }
      })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
