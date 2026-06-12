import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

// Storybook 10 loads this config as an ESM module, where __dirname is undefined.
const __dirname = dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  // Storybook 10: the former addon-essentials features are built into core.
  // Only docs (autodocs) and a11y are registered as explicit addons.
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@components': resolve(__dirname, '../src/components'),
          '@atoms': resolve(__dirname, '../src/components/atoms'),
          '@molecules': resolve(__dirname, '../src/components/molecules'),
          '@organisms': resolve(__dirname, '../src/components/organisms'),
          '@hooks': resolve(__dirname, '../src/hooks'),
          '@store': resolve(__dirname, '../src/store'),
          '@utils': resolve(__dirname, '../src/utils'),
          '@pages': resolve(__dirname, '../src/pages'),
          '@app-types': resolve(__dirname, '../src/types'),
          '@styles': resolve(__dirname, '../src/styles'),
          '@errors': resolve(__dirname, '../src/errors'),
          '@routes': resolve(__dirname, '../src/routes'),
        },
      },
    })
  },
}

export default config
