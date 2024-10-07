import fs from 'fs'
import path from 'path'
import { getDataPath } from '~/utils/get-data-path'

export default defineEventHandler(async (event: Event) => {
  const base = getDataPath()
  const filePath = path.join(base, 'uploads', event.context.params.slug)
  if (!fs.existsSync(filePath)) {
    return { error: 'File not found.', file: filePath }
  }
  if (filePath.includes('.svg')) {
    setResponseHeader(event, 'Content-Type', 'image/svg+xml')
  }
  return sendStream(event, fs.createReadStream(filePath))
})
