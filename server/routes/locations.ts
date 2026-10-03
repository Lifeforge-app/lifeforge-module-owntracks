import { and, asc, gte, lte } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import dayjs from 'dayjs'
import puppeteer from 'puppeteer-core'
import z from 'zod'

import forge from '../forge'
import { owntracksLocations } from '../schema.drizzle'
import { generateStripHTML } from '../utils/generateStripHTML'

const locationDto = createSelectSchema(owntracksLocations).extend({
  inregions: z.array(z.string()),
  inrids: z.array(z.string()),
  motionactivities: z.array(z.string())
})

const trackInput = locationDto
  .omit({
    id: true,
    type: true,
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

export const list = forge
  .query({
    description:
      'Get recorded location coordinates and telemetry for a given date',
    input: {
      query: z.object({
        date: z.string()
      })
    },
    output: {
      OK: z.array(locationDto)
    }
  })
  .callback(async ({ db, query: { date }, response }) => {
    const start = dayjs(date).startOf('day').unix()

    const end = dayjs(date).endOf('day').unix()

    const rows = await db
      .select()
      .from(owntracksLocations)
      .where(
        and(
          gte(owntracksLocations.tst, start),
          lte(owntracksLocations.tst, end)
        )
      )
      .orderBy(asc(owntracksLocations.tst))

    return response.ok(rows)
  })

export const image = forge
  .query({
    encrypted: false,
    isDownloadable: true,
    noAuth: true,
    description:
      'Generate a 384px-wide black and white summary strip image with map and telemetry graphs',
    input: {
      query: z.object({
        date: z.string().optional()
      })
    },
    output: 'custom'
  })
  .callback(async ({ db, query: { date }, res }) => {
    const selectedDate = date || dayjs().format('YYYY-MM-DD')

    const start = dayjs(selectedDate).startOf('day').unix()

    const end = dayjs(selectedDate).endOf('day').unix()

    const locations = await db
      .select()
      .from(owntracksLocations)
      .where(
        and(
          gte(owntracksLocations.tst, start),
          lte(owntracksLocations.tst, end)
        )
      )
      .orderBy(asc(owntracksLocations.tst))

    const html = generateStripHTML({ date: selectedDate, locations })

    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    await page.setViewport({
      width: 384,
      height: 800,
      deviceScaleFactor: 2
    })
    await page.setContent(html)
    await page.evaluate(async () => {
      await document.fonts.ready

      if (typeof customElements !== 'undefined' && customElements.whenDefined) {
        await customElements.whenDefined('iconify-icon').catch(() => {})
      }
      await new Promise(resolve => setTimeout(resolve, 600))
    })

    const imageBuffer = await page.screenshot({
      type: 'png',
      fullPage: true
    })

    await browser.close()

    const buffer = Buffer.isBuffer(imageBuffer)
      ? imageBuffer
      : Buffer.from(imageBuffer)

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Content-Type', 'image/png')
    res.set('x-lifeforge-downloadable', 'true')
    res.status(200).end(buffer)
  })

export const track = forge
  .mutation({
    encrypted: false,
    noAuth: true,
    description:
      'Receive an OwnTracks message. Location updates are recorded; all other message types are acknowledged and discarded.',
    rateLimit: false,
    input: {
      body: trackInput
    },
    output: 'custom'
  })
  .callback(async ({ db, body, res }) => {
    if (body._type !== 'location') {
      return res.json([])
    }

    await db.insert(owntracksLocations).values({
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

    return res.json([])
  })
