<script setup
        lang="ts"
>
import slugify from 'slugify'

const content = defineModel<Content>('content')
defineModel<Content>('initialContent')

const addLayerGroup = () => {
  content.value.layersGroup.push({
    label: '',
    slug: '',
  })
}
const deleteLayerGroup = (slug: string) => {
  const index = content.value.layersGroup.findIndex((layerGroup: LayerGroup) => layerGroup.slug === slug)
  content.value.layersGroup.splice(index, 1)

  // Remove the deleted layerGroup from the layers.
  content.value.layers = content.value.layers.map(
    (layer: Layer) => {
      if (layer.layerGroup === slug) {
        layer.layerGroup = ''
      }
      return layer
    },
  )
}
const updateSlug = (layersGroup: LayerGroup) => {
  const oldSlug = layersGroup.slug
  layersGroup.slug = slugify(layersGroup.label, { lower: true })
  content.value.layers.map((layer: Layer) => {
    if (layer.layerGroup === oldSlug) {
      layer.layerGroup = layersGroup.slug
    }
    return layer
  })
}
</script>

<template>
  <h2 class="mb-2 text-2xl font-semibold">
    Groupe de calque
  </h2>

  <p class="mb-8 text-sm italic text-gray-500">
    Les groupes de calque vous permettent de regrouper des calques sur la carte.
    Un groupe de calques peut contenir un ou plusieurs calques.
  </p>
  <div
    v-for="(layerGroup, index) of content.layersGroup"
    :key="layerGroup.slug"
    class="my-4 rounded bg-zinc-50 p-6"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        #{{ index + 1 }} - {{ layerGroup.label || "Sans-titre" }}
      </h2>
      <button
        type="button"
        class="mt-2 cursor-pointer rounded px-4 py-2 text-sm font-medium tracking-wide text-red-600"
        @click="deleteLayerGroup(layerGroup.slug)"
      >
        Supprimer le groupe de calque
      </button>
    </div>

    <label class="mt-4"><strong>Nom</strong><span class="text-red-500">*</span>

      <input
        v-model="layerGroup.label"
        type="text"
        class="block w-full rounded-md border border-zinc-200 p-2"
        required
        @change="updateSlug(layerGroup)"
      >
    </label>

    <label class="mt-4"><strong>Indications</strong>
      <textarea
        v-model="layerGroup.description"
        class="block w-full rounded-md border border-zinc-200 p-2"
      />
      <AdminMarkdown />
    </label>
  </div>
  <button
    class="block rounded border border-zinc-700 px-4 py-2 text-sm font-medium tracking-wide text-zinc-700"
    type="button"
    @click="addLayerGroup()"
  >
    Ajouter un groupe de calque
  </button>
</template>
