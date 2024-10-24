<script setup lang="ts">
const { layers, index } = defineProps<{
  layers: Layer[]
  index: number
}>()
const feature = defineModel<GeoJsonFeature>('feature')
const emit = defineEmits(['deleteFeature'])

const showDetails = ref(false)

const onLayerChange = () => {
  const type = layers.find(layer => layer.slug === feature.value.properties.layer)?.type
  if (feature.value.geometry.type === 'LineString' && type === 'Point') {
    feature.value.geometry.coordinates = feature.value.geometry.coordinates[0]
  }
  else if (feature.value.geometry.type === 'Point' && type === 'LineString') {
    feature.value.geometry.coordinates = [feature.value.geometry.coordinates as number[]]
  }
  feature.value.geometry.type = type
  console.log(feature)
}
const deleteFeature = (index: number) => {
  emit('deleteFeature', index)
}

const deleteLinePoint = (line, _index) => {
  line.splice(_index, 1)
}
</script>

<template>
  <div class="flex items-center justify-between">
    <h3 class="text-xl font-semibold">
      {{ index + 1 }}. {{ feature.properties.name || "Sans titre" }}
    </h3>
    <button
      type="button"
      class="cursor-pointer rounded px-4 py-2 text-sm text-red-600"
      @click="deleteFeature(index)"
    >
      Supprimer
      <template v-if="feature.geometry.type === 'Point'">
        le point
      </template>
      <template v-else>
        la ligne
      </template>
    </button>
  </div>
  <p
    class="mt-2 cursor-pointer underline"
    @click="showDetails = !showDetails"
  >
    <template v-if="!showDetails">
      Afficher
    </template>
    <template v-else>
      Masquer
    </template>
    le détail
  </p>

  <template v-if="showDetails">
    <label class="mt-4"><strong>Calque</strong><span class="text-red-500">*</span>
      <select
        v-model="feature.properties.layer"
        class="block w-full rounded-md border border-zinc-200 p-2"
        required
        @change="onLayerChange"
      >
        <option
          v-for="layer of layers"
          :key="layer.slug"
          :value="layer.slug"
        >
          {{ layer.label }}
        </option>
      </select>
    </label>
    <div
      v-if="feature.geometry.type === 'Point'"
      class="flex gap-4"
    >
      <label class="mt-4"><strong>Longitude</strong><span class="text-red-500">*</span>
        <input
          v-model="feature.geometry.coordinates[0]"
          type="text"
          class="block w-full rounded-md border border-zinc-200 p-2"
          required
        >
      </label>
      <label class="mt-4"><strong>Latitude</strong><span class="text-red-500">*</span>
        <input
          v-model="feature.geometry.coordinates[1]"
          type="text"
          class="block w-full rounded-md border border-zinc-200 p-2"
          required
        >
      </label>
    </div>
    <div v-else>
      <div
        v-for="(point, _index) in feature.geometry.coordinates"
        :key="_index"
        class="flex items-end gap-4"
      >
        <label class="mt-4"><strong>Longitude</strong><span class="text-red-500">*</span>
          <input
            v-model="point[0]"
            type="text"
            class="block w-full rounded-md border border-zinc-200 p-2"
            required
          >
        </label>
        <label class="mt-4"><strong>Latitude</strong><span class="text-red-500">*</span>
          <input
            v-model="point[1]"
            type="text"
            class="block w-full rounded-md border border-zinc-200 p-2"
            required
          >
        </label>
        <a
          class="cursor-pointer text-sm text-red-600"
          @click="deleteLinePoint(feature.geometry.coordinates, _index)"
        >Supprimer ce point</a>
      </div>
      <button
        class="mt-4 block rounded border border-zinc-700 px-4 py-2 text-sm font-medium tracking-wide text-zinc-700"
        type="button"
        @click="feature.geometry.coordinates.push([])"
      >
        Ajouter un point
      </button>
    </div>
    <label class="mt-4"><strong>Titre de la popup</strong>
      <input
        v-model="feature.properties.name"
        type="text"
        class="block w-full rounded-md border border-zinc-200 p-2"
      >
    </label>
    <label class="mt-4"><strong>Contenu de la popup</strong>
      <textarea
        v-model="feature.properties.description"
        class="block w-full rounded-md border border-zinc-200 p-2"
        rows="8"
      />
      <AdminMarkdown />
    </label>
    <div class="mt-4 flex gap-4">
      <img
        v-if="feature.properties.image"
        :src="feature.properties.image"
        class="w-24 object-cover"
        alt=""
      >
      <label class="block text-sm font-medium leading-6 text-gray-900"><strong>Image de la popup</strong>
        <FileUpload
          v-model="feature.properties.image"
          :button-label="'Ajouter une image'"
        />
      </label>
    </div>
  </template>
</template>
