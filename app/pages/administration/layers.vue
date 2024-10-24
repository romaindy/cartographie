<script setup lang="ts">
const content = defineModel<Content>('content')
defineModel<Content>('initialContent')

const addLayer = () => {
  content.value.layers.push({
    label: '',
    slug: '',
    type: 'Point',
    anchorPosition: 'center',
    layerGroup: '',
  })
}

const deleteLayer = (slug: string) => {
  // Remove the layer.
  content.value.layers = content.value.layers.filter(
    (layer: Layer) => layer.slug !== slug,
  )

  // Remove the deleted layer from features.
  content.value.geoJSON.features = content.value.geoJSON.features.map(
    (feature: GeoJsonFeature) => {
      if (feature.properties.layer === slug) {
        feature.properties.layer = ''
      }
      return feature
    },
  )
}
</script>

<template>
  <h2 class="mb-2 text-2xl font-semibold">
    Calques
  </h2>

  <p class="mb-8 text-sm italic text-gray-500">
    Les calques regroupent un ensemble de points ou de lignes. Ils sont liés à
    un groupe de calques.
  </p>
  <div
    v-for="(layer, index) of content.layers"
    :key="layer.slug"
    class="my-4 rounded bg-zinc-50 p-6"
  >
    <AdminLayer
      v-model:content="content"
      :layer="layer"
      :index="index"
      @delete-layer="deleteLayer"
    />
  </div>
  <button
    class="block rounded border border-zinc-700 px-4 py-2 text-sm font-medium tracking-wide text-zinc-700"
    type="button"
    @click="addLayer()"
  >
    Ajouter un calque
  </button>
</template>
