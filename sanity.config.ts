import {defineConfig, isDev} from 'sanity'
import {visionTool} from '@sanity/vision'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'
import {DistributeToRail} from './actions'

export default defineConfig({
  name: 'default',
  title: 'MoMM DREX',

  projectId: '4udqswqp',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      return context.schemaType === 'rail' ? [...prev.slice(0, 1), DistributeToRail, ...prev.slice(1)] : prev
      // [DistributeToRail, ...prev] : prev
    },
  },
})
