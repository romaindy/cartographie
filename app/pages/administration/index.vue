<script setup
        lang="ts"
>
const { content } = defineProps<{
  content: Content
}>()
defineEmits(['refresh'])

const hasTiles = ref(!!content.map.tiles)

const addOverlay = () => {
  content.map.overlays.push({ bounds: [[], []], image: '', label: '' })
}

const deleteOverlay = (index: number) => {
  content.map.overlays.splice(index, 1)
}
</script>

<template>
  <label><strong>Titre de l'application</strong><span class="text-red-500">*</span>
    <input
      v-model="content.title"
      type="text"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
    >
    <span class="mt-1 block text-sm text-gray-500">
      Titre qui sera affiché dans l'encart au dessus des légendes.
    </span>
  </label>

  <label class="my-4">
    <input
      v-model="hasTiles"
      type="checkbox"
      name="tiles"
      @change="() => { content.map.tiles = hasTiles ? content.map.tiles : null; }"
    >
    Ajouter un service cartographique
    <span class="mt-1 block text-sm text-gray-500">
      Vous pouvez ajouter un service cartographique externe type OpenStreetMap,
      MapBox ou Google Map.
    </span>
  </label>

  <label
    v-if="hasTiles"
    class="mt-4"
  ><strong>URL des tuiles</strong>
    <input
      v-model="content.map.tiles"
      type="text"
      class="block w-full rounded-md border border-zinc-200 p-2"
    >
    <span class="mt-1 block text-sm text-gray-500">
      Example d'URL : https://a.tile.openstreetmap.org/{z}/{x}/{y}.png
    </span>
  </label>

  <AdminOverlay
    v-for="(overlay, index) of content.map.overlays"
    :key="overlay.image"
    :overlay="overlay"
    @delete="deleteOverlay(index)"
  />

  <button
    type="button"
    class="mt-4 block rounded border border-zinc-700 px-4 py-2 text-sm font-medium tracking-wide text-zinc-700"
    @click="addOverlay()"
  >
    Ajouter une image de superposition
  </button>
  <p class="mt-1 block text-sm text-gray-500">
    Vous pouvez ajouter une image de superposition à votre carte en précisant
    les coordonnées de l'image.
  </p>

  <label class="my-4 block">
    <strong>Limiter le déplacement à l'image de superposition</strong>
    <span class="mt-1 block text-sm text-gray-500">
      Cette option vous permet d'empêcher de se déplacer au delà d'une image de
      superposition.<br>Elle peut être utile si vous n'avez pas défini de
      service cartographique et ainsi éviter un fond gris.
    </span>

    <select
      v-model="content.map.maxBounds"

      class="block w-full rounded-md border border-zinc-200 p-2"
    >
      <option value="">Ne pas limiter les déplacements</option>
      <option
        v-for="overlay of content.map.overlays"
        :key="overlay.image"
        :value="overlay.bounds"
      >{{ overlay.label }}
      </option>
    </select>
  </label>

  <label class="mt-4"><strong>Zoom initial de la carte</strong><span class="text-red-500">*</span>
    <input
      v-model="content.map.initialZoom"
      type="text"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
    >
    <span class="mt-1 block text-sm text-gray-500">
      Valeur du zoom initial de la carte comprise entre 0 et 18.
    </span>
  </label>

  <label class="mt-4"><strong>Zoom minimum</strong><span class="text-red-500">*</span>
    <input
      v-model="content.map.minZoom"
      type="text"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
    >
    <span class="mt-1 block text-sm text-gray-500">
      Valeur du zoom minimum de la carte comprise entre 0 et 18.<br>Cette
      valeur peut être utile si vous n'avez pas défini de service cartographique
      et ainsi éviter un fond gris.
    </span>
  </label>
  <label class="mt-4"><strong>Zoom maximum</strong><span class="text-red-500">*</span>
    <input
      v-model="content.map.maxZoom"
      type="text"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
    >
    <span class="mt-1 block text-sm text-gray-500">
      Valeur du zoom maximum de la carte comprise entre 0 et 18.
    </span>
  </label>
</template>
