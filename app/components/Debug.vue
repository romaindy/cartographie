<script lang="ts"
        setup
>
const { map } = defineProps({ map: Object })
const emit = defineEmits(['close'])

const debug = ref({
  center: map.leafletObject.getCenter(),
  zoom: map.leafletObject.getZoom(),
  bounds: map.leafletObject.getBounds(),
  lastClick: null,
})

map?.leafletObject.on('moveend', (e) => {
  debug.value = {
    center: e.target.getCenter(),
    zoom: e.target.getZoom(),
    bounds: e.target.getBounds(),
  }
})
map?.leafletObject.on('click', (e) => {
  debug.value.lastClick = e.latlng
})
</script>

<template>
  <div class="rounded-2xl bg-white p-4">
    <h2>Informations sur la map</h2>
    <p class="mt-2">
      <strong>Centre :</strong> {{ debug.center }} <br>
      <strong>Limites :</strong> {{ debug.bounds }} <br>
      <strong>Zoom :</strong> {{ debug.zoom }}
      <template v-if="debug.lastClick">
        <br>
        <strong>Coordonnées du clic :</strong> {{ debug.lastClick }}
      </template>
    </p>
    <a
      class="cursor-pointer"
      @click="emit('close')"
    >Fermer le mode debug</a>
  </div>
</template>
