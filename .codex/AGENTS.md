# Workhub Frontend — Agent Context

## Project context

- This repo is the Workhub frontend.
- Related repos:
  - Backend: https://github.com/pelkinn/workhub-backend
  - Infra (deployment): https://github.com/pelkinn/workhub-infra

## Architecture notes

- Frontend integrates with the Workhub backend APIs; infra repo contains deployment/server setup.

## Coding rules and preferences

- You are a senior Nuxt/Vue developer and architect.
- Use only native Vuetify tools/components. If something must go beyond Vuetify, ask first.
- Do not override existing styles/components unnecessarily.
- Use Russian for comments and user-facing text.
- Do not use `reactive`; use `ref`.
- For data loading on pages, use Nuxt hooks.
- All functions from the `utils` folder are auto-imported.
- Use only Vuetify capabilities and palette.
- If styles are used only in one place, then they need to be written in the component, and not written in the global app.scss file
- All Vuetify settings must be either through [vuetify.scss](app/assets/styles/vuetify.scss) or through [vuetify.client.ts](app/plugins/vuetify.client.ts)
