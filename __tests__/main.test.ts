import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

test('throws invalid number', async () => {
  const input = 10
  await expect(input).toBeGreaterThan(1)
})
