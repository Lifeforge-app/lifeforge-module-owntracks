import dayjs from 'dayjs'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

import { type InferOutput } from '@lifeforge/api'
import { Box, usePersonalization } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

type LocationRecord = InferOutput<typeof forgeAPI.locations.listCoords>[number]

function OSMMap({
  apiKey,
  locations,
  currentLocation
}: {
  apiKey: string | null
  locations: LocationRecord[]
  currentLocation: LocationRecord | null
}) {
  const { derivedTheme, derivedThemeColor } = usePersonalization()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const baseLayerRef = useRef<L.TileLayer | null>(null)
  const polylineRef = useRef<L.Polyline | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current)

    L.tileLayer(
      'https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
      {
        attribution:
          'Style: <a href="https://www.openrailwaymap.org/">OpenRailwayMap</a> (CC-BY-SA)',
        zIndex: 2
      }
    ).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current

    if (!map) return

    baseLayerRef.current?.remove()

    baseLayerRef.current = L.tileLayer(
      apiKey
        ? `https://tile.tracestrack.com/_/{z}/{x}/{y}.webp?key=${apiKey}`
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: apiKey
          ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://tracestrack.com/">Tracestrack</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        zIndex: 1
      }
    ).addTo(map)
  }, [apiKey, derivedTheme])

  useEffect(() => {
    const tilePane = mapRef.current?.getPane('tilePane')

    if (!tilePane) return

    tilePane.style.filter =
      derivedTheme === 'dark' && !apiKey
        ? 'invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9)'
        : ''
  }, [derivedTheme, apiKey])

  useEffect(() => {
    const map = mapRef.current

    if (!map) return

    polylineRef.current?.remove()
    polylineRef.current = null

    if (locations.length === 0) return

    const polyline = L.polyline(
      locations.map(
        location => [location.lat, location.lon] as [number, number]
      ),
      {
        color: derivedThemeColor,
        opacity: 1,
        weight: 6
      }
    ).addTo(map)

    polylineRef.current = polyline

    map.fitBounds(polyline.getBounds())
  }, [locations, derivedThemeColor])

  useEffect(() => {
    const map = mapRef.current

    if (!map) return

    markerRef.current?.remove()
    markerRef.current = null

    if (!currentLocation) return

    markerRef.current = L.marker([currentLocation.lat, currentLocation.lon], {
      icon: L.divIcon({
        className: '',
        html: `
          <div style="position:absolute;left:0;top:0;transform:translate(-50%,calc(-100% + 10px));display:flex;flex-direction:column;align-items:center;gap:4px;">
            <div style="background:var(--color-bg-50);color:var(--color-bg-800);padding:2px 8px;border-radius:var(--radius-md);box-shadow:0 1px 3px rgba(0,0,0,0.2);font-size:12px;font-weight:600;white-space:nowrap;">
              ${dayjs.unix(currentLocation.tst).format('HH:mm:ss')}
            </div>
            <div style="width:20px;height:20px;border-radius:9999px;border:3px solid white;background:${derivedThemeColor};"></div>
          </div>
        `,
        iconSize: [0, 0]
      })
    }).addTo(map)
  }, [currentLocation, derivedThemeColor])

  return (
    <Box
      ref={containerRef}
      flex="1"
      minHeight="0"
      overflow="hidden"
      r="lg"
      width="100%"
      zIndex="0"
    />
  )
}

export default OSMMap
