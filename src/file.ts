import * as core from '@actions/core'
import {promises as fs} from 'fs'
import path from 'path'

export async function getEncodedFileContents(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath, 'utf8')
  const result = (Buffer.from(data)).toString('base64')
  core.debug(`${result} - file content`)
  return result
}

export async function checkFileExists(filePath: string): Promise<Boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch (error) {
    core.debug(error)
    return false
  }
}

export function parseFileName(filePath: string): string {
  return path.basename(filePath)
}
