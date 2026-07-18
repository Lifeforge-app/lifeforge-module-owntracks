import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as locationsRoutes from './routes/locations'

const routes = forgeRouter({
  locations: locationsRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
