import * as core from '@actions/core'
import * as fs from 'fs'
import path from 'path'

export function getEncodedFileContents(filePath: string): string {
  let result = ''

  fs.readFile(filePath, (error, data) => {
    if (error) {
      throw new Error(`Error occurred while reading file - ${error}`)
    }
    if (data) {
      result = data.toString('base64')
    }
  })

  return result
}

export function checkFileExists(filePath: string): Boolean {
  try {
    fs.accessSync(filePath)

    return true
  } catch (error) {
    core.debug(error)

    return false
  }
}

export function parseFileName(filePath: string): string {
  return path.basename(filePath)
}
