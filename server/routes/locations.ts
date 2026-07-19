import dayjs from 'dayjs'
import z from 'zod'

import forge from '../forge'
import schema from '../schema'

const LocationMessageSchema = schema.locations

export const listCoords = forge
  .query({
    encrypted: false,
    noAuth: true,
    description: 'Get recorded location coordinates for a given date',
    input: {
      query: z.object({
        date: z.string()
      })
    },
    output: {
      OK: z.array(
        schema.locations.pick({
          lat: true,
          lon: true,
          tst: true
        })
      )
    }
  })
  .callback(async ({ pb, query: { date }, response }) =>
    response.ok(
      await pb.getFullList
        .collection('locations')
        .filter([
          {
            field: 'tst',
            operator: '>=',
            value: dayjs(date).startOf('day').unix()
          },
          {
            field: 'tst',
            operator: '<=',
            value: dayjs(date).endOf('day').unix()
          },
          {
            field: 'acc',
            operator: '<=',
            value: 15
          }
        ])
        .sort(['tst'])
        .fields({
          lat: true,
          lon: true,
          tst: true
        })
        .execute()
    )
  )

export const listBattery = forge
  .query({
    encrypted: false,
    noAuth: true,
    description: 'Get recorded battery levels for a given date',
    input: {
      query: z.object({
        date: z.string()
      })
    },
    output: {
      OK: z.array(
        schema.locations.pick({
          batt: true,
          tst: true
        })
      )
    }
  })
  .callback(async ({ pb, query: { date }, response }) =>
    response.ok(
      await pb.getFullList
        .collection('locations')
        .filter([
          {
            field: 'tst',
            operator: '>=',
            value: dayjs(date).startOf('day').unix()
          },
          {
            field: 'tst',
            operator: '<=',
            value: dayjs(date).endOf('day').unix()
          }
        ])
        .sort(['tst'])
        .fields({
          batt: true,
          tst: true
        })
        .execute()
    )
  )

export const listAltitude = forge
  .query({
    encrypted: false,
    noAuth: true,
    description: 'Get recorded altitudes for a given date',
    input: {
      query: z.object({
        date: z.string()
      })
    },
    output: {
      OK: z.array(
        schema.locations.pick({
          alt: true,
          tst: true
        })
      )
    }
  })
  .callback(async ({ pb, query: { date }, response }) =>
    response.ok(
      await pb.getFullList
        .collection('locations')
        .filter([
          {
            field: 'tst',
            operator: '>=',
            value: dayjs(date).startOf('day').unix()
          },
          {
            field: 'tst',
            operator: '<=',
            value: dayjs(date).endOf('day').unix()
          },
          {
            field: 'vac',
            operator: '>',
            value: 0
          }
        ])
        .sort(['tst'])
        .fields({
          alt: true,
          tst: true
        })
        .execute()
    )
  )

export const track = forge
  .mutation({
    encrypted: false,
    noAuth: true,
    description:
      'Receive an OwnTracks message. Location updates are recorded; all other message types are acknowledged and discarded.',
    input: {
      body: LocationMessageSchema.omit({
        id: true,
        type: true,
        collectionId: true,
        collectionName: true,
        created: true,
        updated: true,
        bssid: true,
        ssid: true
      })
        .extend({
          _type: z.string(),
          _id: z.string(),
          SSID: z.string(),
          BSSID: z.string()
        })
        .partial()
    },
    output: 'custom'
  })
  .callback(async ({ pb, body, res }) => {
    if (body._type !== 'location') {
      return res.json([])
    }

    await pb.create
      .collection('locations')
      .data({
        type: body._type,
        message_id: body._id,
        topic: body.topic,
        qos: body.qos,
        retained: body.retained,
        created_at: body.created_at,
        source: body.source,
        batt: body.batt,
        bs: body.bs,
        acc: body.acc,
        vac: body.vac,
        lat: body.lat,
        lon: body.lon,
        alt: body.alt,
        cog: body.cog,
        rad: body.rad,
        vel: body.vel,
        p: body.p,
        t: body.t,
        tst: body.tst,
        m: body.m,
        conn: body.conn,
        poi: body.poi,
        image: body.image,
        imagename: body.imagename,
        tag: body.tag,
        inregions: body.inregions,
        inrids: body.inrids,
        motionactivities: body.motionactivities,
        bssid: body.BSSID,
        ssid: body.SSID,
        tid: body.tid
      })
      .execute()

    return res.json([])
  })
