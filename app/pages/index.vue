<script lang="ts"
        setup
>
import { marked } from 'marked'

const content: Content = await $fetch('/api/content')

const router = useRouter()
const map = ref('map')
const layerGroupReady = ref(false)
const { debug } = usePassword()

// Redirect to admin if there is no settings.
if (!content.map.overlays.length && !content.map.tiles) {
  router.push('/administration')
}

const canvasRenderer = L.canvas({
  padding: 0.5,
  tolerance: 20,
})

content.geoJSON.features = content.geoJSON.features.map(
  (feature: GeoJsonFeature) => {
    feature.geometry.coordinates
          = feature.geometry.type === 'LineString'
        ? feature.geometry.coordinates.map((item: number[]) => item.reverse())
        : feature.geometry.coordinates.reverse()
    return feature
  },
)

const mapReady = () => {
  layerGroupReady.value = true

  // Add the title to the layer controls.
  const div = document.createElement('div')
  div.innerHTML = `<h2 class="text-xl font-semibold mb-4 text-center">${content?.title}</h2><hr class="my-4"/>`
  const layers = document.getElementsByClassName('leaflet-control-layers-list')[1]
  layers?.insertBefore(div, layers.children[0])

  // Put the layer base on the top right controls;
  const layersControls = document.getElementsByClassName('leaflet-control-layers-overlays')[0]
  const layersBase = document.getElementsByClassName('leaflet-control-layers-overlays')[1]
  layersControls?.insertBefore(layersBase, layersControls.children[0])
}

const getLayerGroupLegends = (layerGroup: LayerGroup) => {
  let html = `<div class="layer-group-name my-3 flex gap-2 items-center">${
      layerGroup.label
  } ${
      layerGroup.description ? `<div id="information-${layerGroup.slug}"></div>` : null
  }</div>`

  content.layers
    .filter((layer: Layer) => layerGroup.slug === layer.layerGroup)
    .forEach((layer: Layer) => {
      if (layer.image) {
        html += `<div class="layer-name flex items-center gap-3 ml-2 my-1"><img src="${layer.image}" class="size-6" />${layer.label}</div>`
      }
      else if (layer.lineColor) {
        html += `<div class="layer-name flex items-center gap-1 ml-2 my-1"><svg fill="${layer.lineColor}"  width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="size-6 mr-2"><path d="M3.293,20.707a1,1,0,0,1,0-1.414l16-16a1,1,0,1,1,1.414,1.414l-16,16A1,1,0,0,1,3.293,20.707Z"/></svg>${layer.label}</div>`
      }
      else {
        html += `<div class="layer-name ml-11 my-1">${layer.label}</div>`
      }
    })

  return html
}

const isPointPartOfLayerGroup = (feature: GeoJsonFeature, layerGroup: LayerGroup) => {
  const layer = getLayerByFeature(feature)
  return layer && layerGroup.slug === layer.layerGroup
}

const getLayerByFeature = (feature: GeoJsonFeature): Layer | null => {
  const layerSlug = feature.properties.layer
  return content.layers.find(
    (layer: Layer) => layer.slug === layerSlug,
  )
}

const getIconClass = (feature: GeoJsonFeature) => {
  const layer = getLayerByFeature(feature)
  const classNames = []
  if (layer) {
    classNames.push(layer.imageSize)
    const size = parseInt(layer.imageSize.replace('size-', ''))
    classNames.push('-ml-' + size / 2)

    if (layer.anchorPosition === 'bottom-center') {
      classNames.push('-mt-' + size)
    }
    else {
      classNames.push('-mt-' + size / 2)
    }
  }
  return classNames.join(' ')
}

const getPopupAnchor = (feature: GeoJsonFeature) => {
  const layer = getLayerByFeature(feature)
  const anchor = []
  if (layer) {
    const size = parseInt(layer.imageSize.replace('size-', ''))
    const sizeInPixel = (size * window.innerWidth) / 400
    anchor.push(0)

    if (layer.anchorPosition === 'bottom-center') {
      anchor.push(sizeInPixel * -1)
    }
    else {
      anchor.push(sizeInPixel * -0.5)
    }
  }
  return anchor
}

const popupWidth = computed(() => window.innerWidth / 4)

const onFeatureGroupAdd = (e) => {
  const bounds = e.target.getBounds()
  if (!bounds?._northEast || !bounds?._southWest) return
  map.value.leafletObject.flyToBounds(bounds)
}
</script>

<template>
  <div
    v-if="content.map.overlays.length || content.map.tiles"
    id="expo-map"
  >
    <LMap
      ref="map"
      :options="{
        attributionControl: false,
        zoomControl: false,
        doubleClickZoom: false,
        preferCanvas: true,
      }"
      :zoom="content.map.initialZoom"
      :min-zoom="content.map.minZoom"
      :max-zoom="content.map.maxZoom"
      :center="[48.78883052357491, 2.3885863748929963]"
      :use-global-leaflet="true"
      :max-bounds="content.map.maxBounds || null"
    >
      <LControl
        v-show="debug"
        position="topleft"
      >
        <Debug
          :map="map"
          @close="debug=false"
        />
      </LControl>

      <LControl
        position="bottomright"
        class="!m-0"
      >
        <Credits :content="content.popups.credits" />
      </LControl>

      <LControl
        :position="'topright'"
        class="flex gap-3"
      >
        <Help :content="content.popups.help" />
      </LControl>

      <LControlZoom position="bottomright" />

      <LTileLayer
        v-if="content.map.tiles"
        :url="content.map.tiles"
        :visible="true"
        name="Carte"
      />

      <LImageOverlay
        v-for="overlay of content.map.overlays"
        :key="overlay.image"
        :url="overlay.image"
        :bounds="overlay.bounds"
        :layer-type="overlay.showInControls ? 'overlay' : null"
        :name="overlay.label"
      />

      <LFeatureGroup
        v-for="(layerGroup, index) of content.layersGroup"
        :key="layerGroup.slug"
        :name="getLayerGroupLegends(layerGroup)"
        layer-type="base"
        :visible="index === 0"
        @add="onFeatureGroupAdd"
      >
        <LMarker
          v-for="feature of content.geoJSON.features.filter(
            (_feature) =>
              _feature.geometry.type === 'Point'
              && isPointPartOfLayerGroup(_feature, layerGroup),
          )"
          :key="feature.properties.name"
          :lat-lng="feature.geometry.coordinates"
          :name="feature.properties.name"
        >
          <LIcon
            :icon-url="getLayerByFeature(feature)?.image"
            :class-name="getIconClass(feature)"
            :popup-anchor="getPopupAnchor(feature)"
          />
          <LPopup
            v-if="
              feature.properties.name
                || feature.properties.description
                || feature.properties.image
            "
            :options="{ minWidth: popupWidth }"
          >
            <div>
              <h1
                v-if="feature.properties.name"
                class="text-center"
              >
                {{ feature.properties.name }}
              </h1>
              <div
                v-if="feature.properties.description"
                v-html="
                  marked(
                    feature.properties.description
                      .replace(/\n\n/g, '<br /><br />')
                      .replace(/\n/g, '\n\n'),
                  )
                "
              />
              <img
                v-if="feature.properties.image"
                :src="feature.properties.image"
                class="h-auto w-full"
                alt=""
              >
            </div>
          </LPopup>
        </LMarker>
        <LPolyline
          v-for="feature of content.geoJSON.features.filter(
            (_feature) =>
              _feature.geometry.type === 'LineString'
              && isPointPartOfLayerGroup(_feature, layerGroup),
          )"
          :key="feature.properties.name"
          :lat-lngs="feature.geometry.coordinates"
          :name="feature.properties.name"
          :color="getLayerByFeature(feature)?.lineColor || '#000000'"
          :weight="getLayerByFeature(feature)?.lineWeight || 3"
          :options="{ renderer: canvasRenderer }"
        >
          <LPopup
            v-if="
              feature.properties.name
                || feature.properties.description
                || feature.properties.image
            "
            :options="{ minWidth: popupWidth }"
          >
            <div>
              <h1
                v-if="feature.properties.name"
                class="text-center"
              >
                {{ feature.properties.name }}
              </h1>
              <div
                v-if="feature.properties.description"
                v-html="
                  marked(
                    feature.properties.description
                      .replace(/\n\n/g, '<br />')
                      .replace(/\n/g, '\n\n'),
                  )
                "
              />
              <img
                v-if="feature.properties.image"
                :src="feature.properties.image"
                class="h-auto w-full"
                alt=""
              >
            </div>
          </LPopup>
        </LPolyline>
      </LFeatureGroup>
      <LControlLayers
        position="bottomright"
        :hide-single-base="true"
        :collapsed="false"
      />
      <LControlLayers
        v-if="content.map.overlays?.filter(o => o.showInControls)?.length >= 1"
        position="topright"
        :collapsed="true"
        @ready="mapReady"
      />
    </LMap>

    <template
      v-for="layerGroup of content.layersGroup"
      :key="layerGroup.slug"
    >
      <Teleport
        v-if="layerGroupReady && layerGroup.description"
        :to="`#information-${layerGroup.slug}`"
      >
        <Information :content="layerGroup" />
      </Teleport>
    </template>
  </div>
</template>
