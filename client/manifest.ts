import { lazy } from 'react'

import { createForgeModuleClient } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModuleClient({
  subsection: [
    { label: 'Map', icon: 'tabler:map-pin', path: '' },
    { label: 'Battery', icon: 'tabler:battery', path: 'battery' }
  ],
  routes: {
    '/': lazy(() => import('@/pages/Map')),
    '/battery': lazy(() => import('@/pages/Battery'))
  },
  contract
})

export default manifest

export { forgeAPI }
