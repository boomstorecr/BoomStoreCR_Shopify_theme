# BoomStoreCR Theme

A custom Shopify Online Store 2.0 theme for **BoomStoreCR**, a board game shop based in Costa Rica.

## Tech Stack

- **Liquid** — templating language for rendering storefront markup
- **JSON templates** — Online Store 2.0 template architecture (`templates/*.json`)
- **Sections & Blocks** — modular, merchant-configurable page components (`sections/`, with schema-defined blocks)
- **Snippets** — reusable Liquid partials (`snippets/`)
- **Assets** — CSS and JavaScript delivered via the theme's asset pipeline (`assets/`)
- **Config** — theme settings schema and merchant-configured values (`config/`)
- **Locales** — bilingual storefront and schema translations (`locales/`)

## Localization & Currency

- Bilingual storefront support: **Spanish (es, default)** and **English (en)**
- Storefront translations: [locales/es.default.json](locales/es.default.json), [locales/en.json](locales/en.json)
- Schema (theme editor) translations: [locales/es.default.schema.json](locales/es.default.schema.json), [locales/en.schema.json](locales/en.schema.json)
- Store currency: **CRC (Costa Rican Colón)**

## Folder Structure

```
layout/      Theme layout files (theme.liquid, password.liquid)
templates/   JSON templates mapping page types to sections
sections/    Reusable, schema-configurable page sections
snippets/    Reusable Liquid partials included by sections/templates
assets/      CSS and JavaScript files
config/      Theme settings schema and settings data
locales/     Storefront and schema translation files (es/en)
```

## Shopify CLI Usage

Install the [Shopify CLI](https://shopify.dev/docs/apps/tools/cli) before running these commands.

```sh
# Start a local development server with live theme preview
shopify theme dev

# Push local theme changes to a store
shopify theme push

# Run Theme Check to lint Liquid code for errors and best practices
shopify theme check
```
