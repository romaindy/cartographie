<script setup
        lang="ts"
>
import JsonCSV from 'vue-json-csv'

const { content } = defineProps<{
  content: Content
}>()
const emit = defineEmits(['refresh'])

const format = ref('')
const getLayerBySlug = (slug: string) => {
  return content.layers.find(
    (layer: Layer) => layer.slug === slug,
  )
}

const getLayerLayersGroup = (layerSlug: string): LayerGroup | null => {
  const layer: Layer = getLayerBySlug(layerSlug)
  if (!layer) {
    return
  }
  return content.layersGroup.find(
    (layerGroup: LayerGroup) => layerGroup.slug === layer.layerGroup,
  )
}

const exportData = computed(() => {
  const csv = [
    [
      'Type',
      'Latitude,Longitude',
      'Groupe de calque',
      'Calque',
      'Titre de la pop-up',
      'Contenu de la pop-up',
      'Image de la popup',
    ],
  ]
  content.geoJSON.features.forEach(
    ({ geometry, properties }: GeoJsonFeature) => {
      csv.push([
        geometry.type,
        geometry.coordinates,
        getLayerLayersGroup(properties.layer)?.label,
        getLayerBySlug(properties.layer)?.label,
        properties.name,
        properties.description,
        properties.image.replace('/uploads/', ''),
      ])
    },
  )
  return csv
})

const importData = async () => {
  emit('refresh')
}
</script>

<template>
  <div class="rounded bg-zinc-50 p-8 text-center">
    <h2 class="mb-4 text-xl font-semibold">
      Importer des fichiers
    </h2>
    <p class="mx-auto max-w-3xl">
      Vous pouvez importer :
    </p>
    <ul class="mt-2">
      <li>
        - un fichier <strong>CSV</strong> (suivant le modèle fourni)
      </li>
      <li>- des <strong>images</strong> utilisées pour les calques ou la carte</li>
      <li>
        - un fichier <strong>content.json</strong> (provenant d'une
        sauvegarde)
      </li>
    </ul>
    <FileUpload
      class="mx-auto mt-4"
      button-label="Importer des fichiers"
      @success="importData()"
    />
    <div class="mt-5 rounded bg-orange-100 p-4 text-orange-400">
      Attention, les points précédemment enregistrés seront écrasés. Si vous
      souhaitez ajouter de nouveaux points, téléchargez une sauvegarde et
      ajoutez vos points/lignes au fichier existant.
    </div>
  </div>

  <div class="mt-8 rounded bg-zinc-50 p-8 text-center">
    <h2 class="mb-4 text-xl font-semibold">
      Exporter les données
    </h2>
    <p>
      Vous pouvez exporter les données de l'application sous deux formats :
    </p>
    <ul class="mt-2">
      <li>
        - <strong>.csv (Comma Separated Values)</strong> : fichier tableur contenant uniquement les points et les lignes
      </li>
      <li>
        - <strong>.zip</strong> : dossier contenant l'ensemble des données (un fichier nommé content.json) ainsi que les
        images
      </li>
    </ul>
    <label class="mx-auto my-4 w-1/2 text-left">
      <strong>Format</strong> <br>
      <select
        v-model="format"
        class="block w-full rounded-md border border-zinc-200 p-2"
      >
        <option
          value=""
          selected
          disabled
        >Sélectionner un format
        </option>
        <option value="csv">.csv</option>
        <option value="zip">.zip</option>
      </select>
    </label>

    <JsonCSV
      v-if="format === 'csv'"
      class="mx-auto mt-4 block w-fit cursor-pointer rounded border border-zinc-700 px-4 py-2 text-sm font-medium tracking-wide text-zinc-700"
      :data="exportData"
    >
      Exporter les données
    </JsonCSV>
    <a
      v-if="format === 'zip'"
      href="/api/backup"
      class="mx-auto mt-4 block w-fit cursor-pointer rounded border border-zinc-700 px-4 py-2 text-sm font-medium tracking-wide text-zinc-700"
      download="backup.zip"
      target="_blank"
    >
      Exporter les données
    </a>
  </div>
</template>
