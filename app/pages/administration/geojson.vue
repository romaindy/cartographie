<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

const { textarea } = useTextareaAutosize()
const props = defineProps<{
  content: Content
}>()
defineEmits(['refresh'])

const onGeoJSONChange = ($event: Event) => {
  const value = ($event.target as HTMLInputElement).value
  props.content.geoJSON = JSON.parse(value)
}

watch(() => props.content, () => {
  console.log('changed')
  textarea.value.value = JSON.stringify(props.content.geoJSON, undefined, 4)
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
      class="block w-full rounded-md border border-zinc-200 p-2"
      rows="8"
      @change="onGeoJSONChange"
    >
      {{ JSON.stringify(content.geoJSON, undefined, 4) }}
    </textarea>
  </label>
</template>
