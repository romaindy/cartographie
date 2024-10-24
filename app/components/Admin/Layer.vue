<script setup
        lang="ts"
>
import slugify from 'slugify'

const { layer, index } = defineProps<{
  layer: Layer
  index: number
}>()
const content = defineModel<Content>('content')
defineModel<Content>('initialContent')

const emit = defineEmits(['deleteLayer'])

const deleteLayer = (slug: string) => {
  emit('deleteLayer', slug)
}

if (layer.type === 'Point' && !layer.imageSize) {
  layer.imageSize = 'size-6'
}

const updateSlug = () => {
  const oldSlug = layer.slug
  layer.slug = slugify(layer.label, { lower: true })
  content.value.geoJSON.features.map((feature: GeoJsonFeature) => {
    if (feature.properties.layer === oldSlug) {
      feature.properties.layer = layer.slug
    }
    return feature
  })
}
</script>

<template>
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-semibold">
      #{{ index + 1 }} - {{ layer.label || "Sans-titre" }}
    </h2>
    <button
      type="button"
      class="mt-2 cursor-pointer rounded px-4 py-2 text-sm font-medium tracking-wide text-red-600"
      @click="deleteLayer(layer.slug)"
    >
      Supprimer le calque
    </button>
  </div>

  <label class="mt-4"><strong>Nom</strong><span class="text-red-500">*</span>
    <input
      v-model="layer.label"
      type="text"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
      @change="updateSlug()"
    >
  </label>

  <label class="mt-4"><strong>Type</strong><span class="text-red-500">*</span>
    <select
      v-model="layer.type"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
    >
      <option value="Point">Point</option>
      <option value="LineString">Ligne</option>
    </select>
  </label>

  <label class="mt-4"><strong>Groupe de calque</strong><span class="text-red-500">*</span>
    <select
      v-model="layer.layerGroup"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
    >
      <option
        v-for="layerGroup of content.layersGroup"
        :key="layerGroup.slug"
        :value="layerGroup.slug"
      >
        {{ layerGroup.label }}
      </option>
    </select>
  </label>

  <template v-if="layer.type === 'Point'">
    <div class="mt-4 flex items-center gap-4">
      <img
        v-if="layer.image"
        :src="layer.image"
        class="object-cover"
        :class="layer.imageSize"
        :alt="layer.label"
      >
      <FileUpload
        v-model="layer.image"
        :button-label="
          !layer.image ? 'Ajouter un symbole' : 'Modifier le symbole'
        "
      />
    </div>
    <div class="mt-4 flex items-center gap-4">
      <label><strong>Taille du symbole</strong>
        <select
          v-model="layer.imageSize"
          class="block w-full rounded-md border border-zinc-200 p-2"
        >
          <option value="size-4">Petit</option>
          <option value="size-6">Moyen</option>
          <option value="size-8">Large</option>
          <option value="size-10">XLarge</option>
        </select>
      </label>

      <label><strong>Position du marqueur</strong>
        <select
          v-model="layer.anchorPosition"
          class="block w-full rounded-md border border-zinc-200 p-2"
        >
          <option value="center">Au centre</option>
          <option value="bottom-center">En bas au centre</option>
        </select>
      </label>
    </div>
    <p class="mt-2 text-sm italic text-gray-500">
      Vous pouvez positionner le marqueur au centre des coordonnées ou en bas au centre (utile pour les pointeurs).
    </p>
  </template>
  <template v-if="layer.type === 'LineString'">
    <div class="mt-4 flex gap-8">
      <label><strong>Couleur de la ligne</strong><span class="text-red-500">*</span>
        <input
          v-model="layer.lineColor"
          type="color"
          class="block"
          required
        >
      </label>

      <label><strong>Épaisseur de la ligne</strong>

        <input
          v-model="layer.lineWeight"
          type="number"
          class="block rounded-md border border-zinc-200 p-2"
        >
        <p class="mb-8 text-sm italic text-gray-500">(3 par défaut)</p>
      </label>
    </div>
  </template>
</template>
