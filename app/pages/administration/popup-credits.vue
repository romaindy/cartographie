<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

const { textarea } = useTextareaAutosize()
const { content } = defineProps<{
  content: Content
}>()
defineEmits(['refresh'])
</script>

<template>
  <label><strong>Titre de la pop-up des crédits</strong><span class="text-red-500">*</span>

    <input
      v-model="content.popups.credits.title"
      type="text"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
    >
  </label>
  <label class="mt-4"><strong>Contenu de la pop-up des crédits</strong><span class="text-red-500">*</span>
    <textarea
      ref="textarea"
      v-model="content.popups.credits.content"
      rows="6"
      class="block w-full rounded-md border border-zinc-200 p-2"
      required
    />
    <AdminMarkdown />
  </label>
</template>
