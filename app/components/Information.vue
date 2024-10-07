<script lang="ts" setup>
import { marked } from 'marked'

const displayHelpPopup = ref(false)
const { content } = defineProps<{
  content: LayerGroup
}>()
</script>

<template>
  <IconInformation
    class="size-7 cursor-pointer"
    @click.prevent="displayHelpPopup = !displayHelpPopup"
  />

  <Popup
    v-if="displayHelpPopup"
    @close="displayHelpPopup = false"
  >
    <h1
      class="text-center !text-2xl"
      v-html="content?.label"
    />
    <div
      class="mt-4"
      v-html="
        marked(
          content?.description
            .replace(/\n\n/g, '<br />')
            .replace(/\n/g, '\n\n'),
        )
      "
    />
  </Popup>
</template>
