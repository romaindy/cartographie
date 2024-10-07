import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { getDataPath } from '~/utils/get-data-path'

export default defineEventHandler(async (event: Event) => {
  const base = getDataPath()
  const sourceDir = path.join(base, 'uploads')

  const archive = archiver('zip', { zlib: { level: 9 } })
  const stream = fs.createWriteStream(path.join(base, 'backup.zip'))

  await new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .file(path.join(base, 'content.json'), { name: 'content.json' })
      .on('error', err => reject(err))
      .pipe(stream)

    stream.on('close', () => resolve())
    archive.finalize()
  })

  return sendStream(event, fs.createReadStream(path.join(base, 'backup.zip')))
})
