<script setup
        lang="ts"
>
const { overlay } = defineProps<{
  overlay: Overlay
}>()

const emit = defineEmits(['delete'])

const deleteOverlay = () => {
  emit('delete')
}
</script>

<template>
  <div class="my-4 rounded bg-zinc-100 p-6">
    <label class="mt-4"><strong>Nom de l'image de superposition</strong><span class="text-red-500">*</span>
      <input
        v-model="overlay.label"
        type="text"
        class="block w-full rounded-md border border-zinc-200 p-2"
        required
      >
      <span class="mt-1 block text-sm text-gray-500">
        Le nom de l'image sera affichée dans les légendes et pourra être
        désactivée si un service cartographique est défini.
      </span>
    </label>
    <img
      :src="overlay.image"
      class="mt-4 w-96 object-cover"
      alt=""
    >

    <FileUpload
      v-model="overlay.image"
      :button-label="
        !overlay.image
          ? 'Ajouter une image en superposition'
          : 'Modifier l\'image de superposition'
      "
      class="mt-4"
    />

    <div class="flex gap-4">
      <label class="mt-4"><strong>Latitude nord-est de la
                            carte</strong><span class="text-red-500">*</span>
        <input
          v-model="overlay.bounds[0][0]"
          type="text"
          class="block w-full rounded-md border border-zinc-200 p-2"
          required
        >
      </label>

      <label class="mt-4"><strong>Longitude nord-est de la
                            carte</strong><span class="text-red-500">*</span>
        <input
          v-model="overlay.bounds[0][1]"
          type="text"
          class="block w-full rounded-md border border-zinc-200 p-2"
          required
        >
      </label>
    </div>

    <div class="flex gap-4">
      <label class="mt-4"><strong>Latitude sud-ouest de la
                            carte</strong><span class="text-red-500">*</span>
        <input
          v-model="overlay.bounds[1][0]"
          type="text"
          class="block w-full rounded-md border border-zinc-200 p-2"
          required
        >
      </label>

      <label class="mt-4"><strong>Longitude sud-ouest de la
                            carte</strong><span class="text-red-500">*</span>
        <input
          v-model="overlay.bounds[1][1]"
          type="text"
          class="block w-full rounded-md border border-zinc-200 p-2"
          required
        >
      </label>
    </div>

    <label class="my-4">
      <input
        v-model="overlay.showInControls"
        type="checkbox"
        name="showInControls"
      >
      Afficher l'image dans les contrôles
      <span class="mt-1 block text-sm text-gray-500">
        Vous pouvez activer ou désactiver l'affichage de l'image dans la boîte de contrôle située en haut à droite de la carte. <br>
        Si c'est la case est décochée, l'image sera alors toujours affichée.
      </span>
    </label>

    <a
      class="mt-4 block cursor-pointer text-right text-red-500"
      @click="deleteOverlay()"
    >Supprimer l'image de superposition</a>
  </div>
</template>
