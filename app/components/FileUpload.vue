<script setup
        lang="ts"
>
import { useFileDialog } from '@vueuse/core'

const { buttonLabel } = defineProps<{
  buttonLabel: string
}>()
const emit = defineEmits(['update:modelValue', 'success'])

const { $toast } = useNuxtApp()

const { open, reset, onChange } = useFileDialog({
  directory: false,
})

onChange(async (files: FileList) => {
  if (!files) {
    return
  }
  const body = new FormData()
  if (files.length === 1) {
    body.append('files', files[0])
  }
  else {
    for (const file of files) {
      body.append('files', file)
    }
  }
  try {
    const response: object[] = await $fetch('/api/uploads', {
      method: 'POST',
      body,
    })
    reset()

    $toast.success(
      response.length === 1
        ? 'Le fichier a bien été enregistré.'
        : 'Les fichiers ont bien été enregistrés.',
    )
    emit('success')
    emit('update:modelValue', response[0].filePath)
  }
  catch (e) {
    console.error(e)
    $toast.error(e.statusMessage)
  }
})
</script>

<template>
  <button
    type="button"
    class="block rounded border border-zinc-700 px-4 py-2 text-sm font-medium tracking-wide text-zinc-700"
    @click="open"
  >
    {{ buttonLabel }}
  </button>
</template>
