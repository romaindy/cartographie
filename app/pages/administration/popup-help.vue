<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

const { textarea } = useTextareaAutosize()
const content = defineModel<Content>('content')
defineModel<Content>('initialContent')
</script>

<template>
  <label><strong>Titre de la pop-up d'aide</strong><span class="text-red-500">*</span>
    <input
      v-model="content.popups.help.title"
      type="text"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
    >
  </label>
  <label class="mt-4"><strong>Contenu de la pop-up d'aide</strong><span class="text-red-500">*</span>
    <textarea
      ref="textarea"
      v-model="content.popups.help.content"
      rows="6"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
    />
    <AdminMarkdown />
  </label>
</template>
