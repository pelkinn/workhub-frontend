// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // Требует PascalCase для компонентов в шаблонах
      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        registeredComponentsOnly: false,
        ignores: []
      }],
      // Требует PascalCase для имен компонентов в определении
      'vue/component-definition-name-casing': ['error', 'PascalCase']
    }
  }
)
