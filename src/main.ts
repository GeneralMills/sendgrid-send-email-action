import * as core from '@actions/core'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
