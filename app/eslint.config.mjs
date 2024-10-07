// @ts-check
import tailwind from 'eslint-plugin-tailwindcss'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 0,
      'vue/no-multiple-template-root': 0,
      'vue/no-v-html': 0,
      'vue/no-mutating-props': 0,
    },
  },
  ...tailwind.configs['flat/recommended'],
)
