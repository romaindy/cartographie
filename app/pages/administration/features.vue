<script setup lang="ts">
const { content } = defineProps<{
  content: Content
}>()
defineEmits(['refresh'])

if (content.layers.length === 1) {
  content.geoJSON.features = content.geoJSON.features.map(
    (feature: GeoJsonFeature) => {
      feature.properties.layer = content.layers[0].slug
      return feature
    },
  )
}

const deleteFeature = (index: number) => {
  content.geoJSON.features.splice(index, 1)
}

const addFeature = () => {
  content.geoJSON.features.push({
    type: 'Feature',
    properties: {
      name: ' ',
      description: '',
      layer: '',
      image: '',
    },
    geometry: {
      type: 'Point',
      coordinates: [],
    },
  })
}
</script>

<template>
  <h2 class="mb-8 text-2xl font-semibold">
    Points et lignes
  </h2>

  <div
    v-for="(feature, index) of content.geoJSON.features"
    :key="feature.name"
    class="my-4 rounded bg-zinc-50 p-8"
  >
    <AdminFeature
      :feature="feature"
      :index="index"
      :layers="content.layers"
      @delete-feature="deleteFeature"
    />
  </div>

  <button
    class="block rounded border border-zinc-700 px-4 py-2 text-sm font-medium tracking-wide text-zinc-700"
    type="button"
    @click="addFeature()"
  >
    Ajouter un point/ligne
  </button>
</template>
