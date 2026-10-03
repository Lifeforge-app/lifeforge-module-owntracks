import { createForgeContractBuilder } from '@lifeforge/server-utils'

import * as schema from './schema.drizzle'

export type OwntracksSchema = typeof schema

const forge = createForgeContractBuilder({
  schema,
  modulePathAlias: 'owntracks'
})

export default forge
