import * as fs from 'fs'
import path from 'path'
import type { MultiPartData } from 'h3'
import slugify from 'slugify'
import { parseCSV } from '~/utils/parse-csv'
import { getDataPath } from '~/utils/get-data-path'
import { isJsonValid } from '~/utils/is-json-valid'

export default defineEventHandler(async (event: Event) => {
  const content: Content = JSON.parse(
    fs.readFileSync(getDataPath() + '/content.json', 'utf8'),
  )

  const files: MultiPartData[] = await readMultipartFormData(event)
  const response: object[] = []

  files.forEach((file: MultiPartData) => {
    if (!file.filename) {
      return
    }
    const filename = slugify(file.filename, { lower: true })

    // If a content.json has been uploaded, save it.
    if (file.filename.includes('content.json')) {
      if (!isJsonValid(file.data)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Le fichier content.json n\'est pas valide.',
        })
      }
      fs.writeFileSync(getDataPath() + '/content.json', file.data)
    }
    else if (file.filename.includes('.csv')) {
      (async () => {
        const records = await parseCSV(file.data)
        const geoJsonFeatures: GeoJsonFeature[] = []
        records.forEach((line) => {
          let layerGroup: LayerGroup | undefined = content.layersGroup.find(
            (_layerGroup: LayerGroup) => _layerGroup.label === line[2],
          )

          let layer: Layer | undefined = content.layers.find(
            (layer: Layer) => layer.label === line[3],
          )

          if (!layer) {
            layer = {
              type: line[0],
              slug: slugify(line[3], { lower: true }),
              label: line[3],
              layerGroup: slugify(line[2], { lower: true }),
            }
            content.layers.push(layer)
          }

          if (!layerGroup) {
            layerGroup = {
              slug: slugify(line[2], { lower: true }),
              label: line[2],
            }
            content.layersGroup.push(layerGroup)
          }

          geoJsonFeatures.push({
            type: 'Feature',
            properties: {
              name: line[4],
              description: line[5],
              layer: layer.slug,
              image: '/uploads/' + line[6],
            },
            geometry: {
              type: line[0],
              coordinates:
                                line[0] === 'Point'
                                  ? line[1].split(',')
                                  : line[1]
                                    .match(/([0-9]+\.[0-9]+),([0-9]+\.[0-9]+)/gm)
                                    .map((val: string) => val.split(',')),
            },
          })
        })
        content.geoJSON.features = geoJsonFeatures
        fs.writeFileSync(
          getDataPath() + '/content.json',
          JSON.stringify(content),
        )
      })()
    }
    else {
      const filePath = path.join(getDataPath(), 'uploads', filename)
      fs.writeFileSync(filePath, file.data)
    }

    response.push({ filePath: '/uploads/' + filename })
  })
  return response
})
