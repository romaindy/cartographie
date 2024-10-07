<script setup
        lang="ts"
>
import defaultContent from '../../../config/content.json'

const emit = defineEmits(['refresh'])
const confirmation = ref('')
const { $toast } = useNuxtApp()

const isFormValid = computed(() => {
  return (confirmation.value === 'Ré-initialiser l\'application avec les données initiales.')
})

const reset = async () => {
  if (isFormValid.value) {
    confirmation.value = ''
    await $fetch('/api/content', {
      method: 'post',
      body: defaultContent,
    })
    emit('refresh')
    $toast.success('L\'application a bien été ré-initialisée.')
  }
}
</script>

<template>
  <div class="">
    <h2 class="mb-4 text-xl font-semibold">
      Ré-initialiser l'application
    </h2>

    <label><strong>Phrase de sécurité</strong><span class="text-red-500">*</span>
      <input
        v-model="confirmation"
        type="text"
        class="block w-full rounded-md border border-zinc-200 p-2"
        pattern="Ré-initialiser l'application avec les données initiales."
        required
      >
      <span class="mt-1 block text-sm text-gray-500">
        Recopiez la phrase suivante : "Ré-initialiser l'application avec les
        données initiales."
      </span>
    </label>

    <button
      type="button"
      :disabled="!isFormValid"
      class="mt-4 rounded bg-red-700 px-4 py-2 text-white"
      :class="!isFormValid ? 'opacity-50 cursor-not-allowed':''"
      @click="reset()"
    >
      Ré-initialiser l'application
    </button>
  </div>
</template>
