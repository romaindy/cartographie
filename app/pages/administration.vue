<script setup
        lang="ts"
>
import { version } from '../../package.json'

const router = useRouter()
const route = useRoute()
const initialContent = ref(await $fetch('/api/content'))
const content = ref(JSON.parse(JSON.stringify(initialContent.value)))
const { $toast } = useNuxtApp()
const confirmQuit = ref(false)

async function submit() {
  initialContent.value = await $fetch('/api/content', {
    method: 'post',
    body: content.value,
  })

  $toast.success('Les données ont bien été enregistrées.')
}

const refresh = async () => {
  const _content = await $fetch('/api/content')
  content.value = { ..._content }
}

const tabs = [
  {
    to: '/administration/',
    label: 'Carte',
  },
  {
    to: '/administration/layers-group',
    label: 'Groupe de calques',
  },
  {
    to: '/administration/layers',
    label: 'Calques',
  },
  {
    to: '/administration/features',
    label: 'Points et lignes',
  },
  {
    to: '/administration/popup-help',
    label: 'Pop-up "Aide"',
  },
  {
    to: '/administration/popup-credits',
    label: 'Pop-up "Crédits"',
  },
  {
    to: '/administration/geojson',
    label: 'GeoJSON',
  },
  {
    to: '/administration/bulk-imports',
    label: 'Importer/Exporter',
  },
  {
    to: '/administration/reset',
    label: 'Reset',
  },
]

const hasChanged = computed(() => {
  return JSON.stringify(content.value) !== JSON.stringify(initialContent.value)
})
</script>

<template>
  <div class="mb-12 bg-zinc-100 py-12 text-center">
    <header class="mx-auto max-w-5xl">
      <h1 class="text-4xl font-bold">
        Administration de l'application Carte
      </h1>
      <p class="mt-4 text-sm text-gray-500">
        Version {{ version }}
      </p>
    </header>
  </div>
  <div class="mx-auto max-w-5xl overflow-hidden">
    <ul class="flex justify-between text-sm">
      <li
        v-for="tab of tabs"
        :key="tab.label"
      >
        <NuxtLink
          :to="tab.to"
          class="block py-2 text-gray-500 hover:border-b-2 hover:border-black hover:!text-black"
          exact-active-class="border-b-2 border-black !text-black"
        >{{ tab.label }}
        </NuxtLink>
      </li>
    </ul>
  </div>
  <form
    class="mx-auto mb-32 mt-12 max-w-5xl"
    @submit.prevent="submit()"
  >
    <NuxtPage
      :content="content"
      @refresh="refresh()"
    />

    <div class="fixed bottom-0 left-0 w-full border-t bg-white">
      <div
        class="mx-auto flex max-w-5xl items-center justify-between gap-6 py-4"
      >
        <a
          class="cursor-pointer"
          @click="hasChanged ? confirmQuit = true : router.push('/')"
        >
          Retour à la carte
        </a>

        <template v-if="!route.path.includes('bulk') && !route.path.includes('reset')">
          <span
            class="ml-auto cursor-pointer text-gray-500"
            :class="!hasChanged ? 'opacity-50 cursor-not-allowed':''"
            @click="refresh()"
          >Annuler les modifications
          </span>

          <input
            type="submit"
            value="Sauvegarder les modifications"
            :disabled="!hasChanged"
            class="cursor-pointer rounded bg-green-600 px-4 py-3 text-white"
            :class="!hasChanged ? 'opacity-50 cursor-not-allowed':''"
          >
        </template>
      </div>
    </div>

    <Popup
      v-if="confirmQuit"
      @close="confirmQuit = false"
    >
      <h1
        class="text-center text-2xl font-semibold"
      >
        Êtes-vous sûr de vouloir quitter l'administration ?
      </h1>
      <div
        class="mt-4"
      >
        <p
          v-if="hasChanged"
          class="text-center"
        >
          Vous avez des modifications non sauvegardées.
        </p>
        <div class="mt-4 flex justify-center gap-4">
          <NuxtLink
            to="/"
            class="block rounded bg-red-600 px-4 py-2 text-sm font-medium tracking-wide text-white"
          >
            Quitter
          </NuxtLink>
          <button
            type="button"
            class="block rounded border border-zinc-700 px-4 py-2 text-sm font-medium tracking-wide text-zinc-700"
            @click="confirmQuit=false"
          >
            Annuler
          </button>
        </div>
      </div>
    </Popup>
  </form>
</template>
