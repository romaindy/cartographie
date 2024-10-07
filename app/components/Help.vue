<script setup lang="ts">
import { marked } from 'marked'

const displayHelpPopup = ref(false)
const { content } = defineProps<{
  content: Content
}>()
</script>

<template>
  <button
    class="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white text-xl shadow"
    @click="displayHelpPopup = !displayHelpPopup"
  >
    ?
  </button>

  <Popup
    v-if="displayHelpPopup"
    @close="displayHelpPopup = false"
  >
    <h1
      class="text-center !text-2xl"
      v-html="content?.title"
    />
    <div
      class="mt-4"
      v-html="
        marked(
          content?.content.replace(/\n\n/g, '<br />').replace(/\n/g, '\n\n'),
        )
      "
    />
  </Popup>
</template>
