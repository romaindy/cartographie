import { Readable } from 'stream'
import { parse } from 'csv-parse'

export async function parseCSV(fileData: Buffer) {
  const records = []
  const parser = Readable.from(fileData).pipe(
    parse({
      delimiter: ',',
      from: 2,
    }),
  )
  for await (const record of parser) {
    // Work with each record
    records.push(record)
  }
  return records
}
