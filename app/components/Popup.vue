<script lang="ts" setup>
const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<template>
  <div
    class="fixed left-0 top-0 size-full bg-black/20"
    @click.prevent="close()"
  />
  <div
    class="fixed left-1/2 top-1/2 z-[10000] w-2/5 max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-8 font-normal"
  >
    <div
      class="absolute right-0 top-0 mr-4 mt-2 cursor-pointer text-3xl text-gray-800"
      @click.prevent="close()"
    >
      &times;
    </div>
    <slot />
  </div>
</template>
