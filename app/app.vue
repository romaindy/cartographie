<script setup>
const router = useRouter()

// Refresh after 5 minutes of inactivity
let timeout
function restartTimeout() {
  clearTimeout(timeout)
  timeout = setTimeout(() => router.go(0), 5 * 60 * 1000)
}
</script>

<template>
  <div
    @mousemove="restartTimeout()"
    @click="restartTimeout()"
  >
    <NuxtPage />
  </div>
</template>
