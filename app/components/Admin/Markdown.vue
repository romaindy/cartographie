<script setup>
const showDetails = ref(false)
</script>

<template>
  <p class="mt-1 block text-sm leading-7 text-gray-500">
    Le format Markdown est accepté ici.<br>
    <a
      class="underline"
      @click="showDetails = !showDetails"
    ><template v-if="!showDetails">Afficher plus de</template><template v-else>Cacher les</template> détails</a>
    -
    <a
      href="https://www.markdownguide.org/cheat-sheet/"
      target="_blank"
      class="underline"
    >Afficher le site Markdown Guide</a>
  </p>
  <p
    v-if="showDetails"
    class="mt-1 block text-sm text-gray-500"
  >
    Il vous permet de mettre en forme le texte de façon simple.<br>
    # Titre 1<br>
    ## Titre 2 etc.<br>
    **<strong>gras</strong>**<br>
    *<em>italic</em>*<br>
    Ligne horizontale : ---
  </p>
</template>
