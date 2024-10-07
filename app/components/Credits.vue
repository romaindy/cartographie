<script lang="ts" setup>
import { marked } from 'marked'

const displayHelpPopup = ref(false)
const { content } = defineProps<{
  content: Content
}>()
</script>

<template>
  <div
    class="cursor-pointer bg-white/80 px-2"
    @click="displayHelpPopup = !displayHelpPopup"
  >
    <p class="">
      Crédits
    </p>
  </div>

  <Popup
    v-if="displayHelpPopup"
    @close="displayHelpPopup = false"
  >
    <h1
      class="text-center !text-2xl"
      v-html="content.title"
    />
    <p
      class="mt-4 whitespace-pre-line"
      v-html="
        marked(
          content.content.replace(/\n\n/g, '<br />').replace(/\n/g, '\n\n'),
        )
      "
    />
  </Popup>
</template>
