import * as fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { getDataPath } from '~/utils/get-data-path'

export default defineEventHandler(async (event: Event) => {
  const oldContent = JSON.parse(
    fs.readFileSync(getDataPath() + '/content.json', 'utf-8'),
  )
  const body = await readBody(event)
  const content = { ...oldContent, ...body }

  content.map.initialZoom = parseFloat(content.map.initialZoom)
  content.map.minZoom = parseFloat(content.map.minZoom)
  content.map.maxZoom = parseFloat(content.map.maxZoom)

  // Generate slug for layersGroup.
  content.layersGroup.forEach((layerGroup: LayerGroup) => {
    layerGroup.slug = slugify(layerGroup.label, { lower: true })
  })

  // Generate slug for layers.
  content.layers.forEach((layer: Layer) => {
    layer.slug = slugify(layer.label, { lower: true })
  })

  cleanUpImages(content)

  fs.writeFileSync(getDataPath() + '/content.json', JSON.stringify(content))
  return content
})

function cleanUpImages(content) {
  const images = []

  content.map.overlays.forEach((overlay: Overlay) => {
    images.push(overlay.image)
  })

  content.layers.forEach((layer: Layer) => {
    images.push(layer.image)
  })

  content.geoJSON.features.forEach((feature: GeoJsonFeature) => {
    if (feature.properties.image) {
      images.push(feature.properties.image)
    }
  })

  const serverImages = fs.readdirSync(getDataPath() + '/uploads')
  const imagesToRemove = serverImages.filter(x => !images.includes('/uploads/' + x))

  imagesToRemove.forEach((image: string) => {
    fs.rmSync(path.resolve(getDataPath(), 'uploads', image))
  })
}
