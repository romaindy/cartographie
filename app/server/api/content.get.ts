import fs from 'fs'
import { getDataPath } from '~/utils/get-data-path'

export default defineEventHandler(async () => {
  const content = fs.readFileSync(getDataPath() + '/content.json', 'utf-8')

  return JSON.parse(content)
})
