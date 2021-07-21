import * as core from '@actions/core'
import { promises as fs } from 'fs';
import path from 'path';

export async function getFileContents(filePath:string) : Promise<string> {
  return await fs.readFile(filePath, 'utf8');
}

export async function checkFileExists(filePath:string) : Promise<Boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    core.debug(error);
    return false;
  };
}

export function parseFileName(filePath:string) {
  return path.basename(filePath);
}