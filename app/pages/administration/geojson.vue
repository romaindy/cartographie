<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

const { textarea } = useTextareaAutosize()
const content = defineModel<Content>('content')
defineModel<Content>('initialContent')

const onGeoJSONChange = ($event: Event) => {
  const value = ($event.target as HTMLInputElement).value
  content.value.geoJSON = JSON.parse(value)
}

watch(() => content.value, () => {
  textarea.value.value = JSON.stringify(content.value.geoJSON, undefined, 4)
}, { deep: true })
</script>

<template>
  <h2 class="mb-2 text-2xl font-semibold">
    GeoJSON
  </h2>
  <p class="mb-8 text-sm italic text-gray-500">
    Le GeoJSON est un format d'échange de données cartographiques normalisé.
    <br>
    Vous pouvez créer des points et des lignes grâce à ce site
    <NuxtLink
      to="https://geojson.io/"
      external
    >
      https://geojson.io/
    </NuxtLink>
    et copier-coller le résultat obtenu ci-dessous.
  </p>
  <label><strong>GeoJSON</strong>
    <textarea
      ref="textarea"
      :value="JSON.stringify(content.geoJSON, undefined, 4)"
      class="block w-full rounded-md border border-zinc-200 p-2"
      rows="8"
      @change="onGeoJSONChange"
    />
  </label>
</template>
