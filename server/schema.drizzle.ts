import { type RelationsBuilder } from 'drizzle-orm'
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'

import { createModuleTable } from '@lifeforge/drizzle'

const pgTable = createModuleTable()

export const owntracksLocations = pgTable('locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: text('type').notNull().default(''),
  message_id: text('message_id').notNull().default(''),
  topic: text('topic').notNull().default(''),
  qos: integer('qos').notNull().default(0),
  retained: boolean('retained').notNull().default(false),
  created_at: integer('created_at').notNull().default(0),
  source: text('source').notNull().default(''),
  batt: doublePrecision('batt').notNull().default(0),
  bs: doublePrecision('bs').notNull().default(0),
  acc: doublePrecision('acc').notNull().default(0),
  vac: doublePrecision('vac').notNull().default(0),
  lat: doublePrecision('lat').notNull().default(0),
  lon: doublePrecision('lon').notNull().default(0),
  alt: doublePrecision('alt').notNull().default(0),
  cog: doublePrecision('cog').notNull().default(0),
  rad: doublePrecision('rad').notNull().default(0),
  vel: doublePrecision('vel').notNull().default(0),
  p: doublePrecision('p').notNull().default(0),
  t: text('t').notNull().default(''),
  tst: integer('tst').notNull().default(0),
  m: integer('m').notNull().default(0),
  conn: text('conn').notNull().default(''),
  poi: text('poi').notNull().default(''),
  image: text('image').notNull().default(''),
  imagename: text('imagename').notNull().default(''),
  tag: text('tag').notNull().default(''),
  inregions: jsonb('inregions').$type<string[]>().notNull().default([]),
  inrids: jsonb('inrids').$type<string[]>().notNull().default([]),
  motionactivities: jsonb('motionactivities')
    .$type<string[]>()
    .notNull()
    .default([]),
  bssid: text('bssid').notNull().default(''),
  ssid: text('ssid').notNull().default(''),
  tid: text('tid').notNull().default(''),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const tables = { locations: owntracksLocations }

export const relations = (_r: RelationsBuilder<typeof tables>) => ({})
