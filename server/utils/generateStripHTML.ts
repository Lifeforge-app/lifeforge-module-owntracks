import dayjs from 'dayjs'

type LocationItem = {
  lat: number
  lon: number
  tst: number
  alt?: number
  batt?: number
  vel?: number
  acc?: number
  vac?: number
  p?: number
  cog?: number
  rad?: number
  [key: string]: unknown
}

type ChartConfig = {
  id: string
  title: string
  unit: string
  icon: string
  avgVal: string
  maxValStr: string
  labels: string[]
  data: number[]
  min?: number
  max?: number
}

function calculateDistance(points: LocationItem[]): number {
  let totalMeters = 0

  for (let i = 1; i < points.length; i++) {
    const p1 = points[i - 1]
    const p2 = points[i]
    const R = 6371e3
    const φ1 = (p1.lat * Math.PI) / 180
    const φ2 = (p2.lat * Math.PI) / 180
    const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180
    const Δλ = ((p2.lon - p1.lon) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    totalMeters += R * c
  }

  return totalMeters
}

function buildChartConfig({
  id,
  title,
  unit,
  icon,
  points,
  fixedDomain
}: {
  id: string
  title: string
  unit: string
  icon: string
  points: Array<{ tst: number; value: number }>
  fixedDomain?: [number, number]
}): ChartConfig | null {
  if (points.length === 0) return null

  const values = points.map(p => p.value)
  const maxVal = fixedDomain ? fixedDomain[1] : Math.max(...values)
  const maxValStr = maxVal % 1 === 0 ? maxVal.toString() : maxVal.toFixed(1)
  const avgVal = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)

  return {
    id,
    title,
    unit,
    icon,
    avgVal,
    maxValStr,
    labels: points.map(p => dayjs.unix(p.tst).format('HH:mm')),
    data: values,
    min: fixedDomain ? fixedDomain[0] : undefined,
    max: fixedDomain ? fixedDomain[1] : undefined
  }
}

export function generateStripHTML({
  date,
  locations
}: {
  date: string
  locations: LocationItem[]
}): string {
  const formattedDate = dayjs(date).format('dddd, MMMM D, YYYY')
  const hasLocations = locations.length > 0

  if (!hasLocations) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <script src="https://code.iconify.design/iconify-icon/2.3.0/iconify-icon.min.js"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap" rel="stylesheet" />
        <style>
          * {
            font-family: "Onest", sans-serif;
          }
        </style>
      </head>
      <body class="flex p-4 text-zinc-900 flex-col w-[384px] border-2 border-black bg-white">
        <header class="border-b-2 border-zinc-800 pb-2 mb-1 w-full flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <iconify-icon icon="tabler:map-pin" width="24" height="24" class="text-black"></iconify-icon>
            <h1 class="text-lg font-semibold tracking-wide">OwnTracks Statistics</h1>
          </div>
          <div class="flex items-center justify-end tracking-wider font-medium text-xs gap-1 text-zinc-500">
            <span>powered by</span>
            <iconify-icon icon="tabler:hammer" width="16" height="16" class="text-black"></iconify-icon>
            <span class="text-zinc-800">Lifeforge<span class="text-black">.</span></span>
          </div>
        </header>
        <div class="flex-1 w-full space-y-2 mt-4 text-center p-6">
          <p class="text-sm font-semibold">${formattedDate}</p>
          <p class="text-zinc-500 text-xs mt-2 italic">No location records found for this date.</p>
        </div>
        <div class="border-t-2 mt-4 border-zinc-800 flex items-center justify-center p-2 text-xs">
          <p class="text-zinc-500">[Computer Generated Report]</p>
        </div>
      </body>
      </html>
    `
  }

  const startTime = dayjs.unix(locations[0].tst).format('HH:mm:ss')
  const endTime = dayjs
    .unix(locations[locations.length - 1].tst)
    .format('HH:mm:ss')
  const totalPoints = locations.length
  const totalDistMeters = calculateDistance(locations)
  const totalDistKm = (totalDistMeters / 1000).toFixed(2)

  // Chart datasets
  const charts: ChartConfig[] = [
    buildChartConfig({
      id: 'alt',
      title: 'Altitude',
      unit: 'm',
      icon: 'tabler:mountain',
      points: locations
        .filter(l => typeof l.alt === 'number' && l.alt !== 0)
        .map(l => ({ tst: l.tst, value: l.alt as number }))
    }),
    buildChartConfig({
      id: 'batt',
      title: 'Battery',
      unit: '%',
      icon: 'tabler:battery',
      points: locations
        .filter(l => typeof l.batt === 'number')
        .map(l => ({ tst: l.tst, value: l.batt as number })),
      fixedDomain: [0, 100]
    }),
    buildChartConfig({
      id: 'vel',
      title: 'Speed',
      unit: 'km/h',
      icon: 'tabler:gauge',
      points: locations
        .filter(l => typeof l.vel === 'number')
        .map(l => ({ tst: l.tst, value: l.vel as number }))
    }),
    buildChartConfig({
      id: 'acc',
      title: 'Accuracy',
      unit: 'm',
      icon: 'tabler:target',
      points: locations
        .filter(l => typeof l.acc === 'number')
        .map(l => ({ tst: l.tst, value: l.acc as number }))
    }),
    buildChartConfig({
      id: 'vac',
      title: 'Vertical Accuracy',
      unit: 'm',
      icon: 'tabler:ruler-measure',
      points: locations
        .filter(l => typeof l.vac === 'number' && l.vac > 0)
        .map(l => ({ tst: l.tst, value: l.vac as number }))
    }),
    buildChartConfig({
      id: 'p',
      title: 'Pressure',
      unit: 'kPa',
      icon: 'tabler:gauge-filled',
      points: locations
        .filter(l => typeof l.p === 'number' && l.p > 0)
        .map(l => ({ tst: l.tst, value: l.p as number }))
    }),
    buildChartConfig({
      id: 'cog',
      title: 'Heading',
      unit: '°',
      icon: 'tabler:compass',
      points: locations
        .filter(l => typeof l.cog === 'number')
        .map(l => ({ tst: l.tst, value: l.cog as number })),
      fixedDomain: [0, 360]
    }),
    buildChartConfig({
      id: 'rad',
      title: 'Radius',
      unit: 'm',
      icon: 'tabler:circle-dashed',
      points: locations
        .filter(l => typeof l.rad === 'number' && l.rad > 0)
        .map(l => ({ tst: l.tst, value: l.rad as number }))
    })
  ].filter((c): c is ChartConfig => c !== null)

  const coordsJSON = JSON.stringify(locations.map(l => [l.lat, l.lon]))
  const chartsJSON = JSON.stringify(charts)

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      <script src="https://code.iconify.design/iconify-icon/2.3.0/iconify-icon.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * {
          font-family: "Onest", sans-serif;
        }
      </style>
    </head>
    <body class="flex p-4 text-zinc-900 flex-col w-[384px] border-2 border-black bg-white box-border">
      <header class="border-b-2 border-zinc-800 pb-2 mb-1 w-full flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <iconify-icon icon="tabler:map-pin" width="24" height="24" class="text-black"></iconify-icon>
          <h1 class="text-lg font-semibold tracking-wide">OwnTracks Statistics</h1>
        </div>
        <div class="flex items-center justify-end tracking-wider font-medium text-xs gap-1 text-zinc-500">
          <span>powered by</span>
          <iconify-icon icon="tabler:hammer" width="16" height="16" class="text-black"></iconify-icon>
          <span class="text-zinc-800">Lifeforge<span class="text-black">.</span></span>
        </div>
      </header>

      <div class="flex-1 w-full space-y-2 mt-4">
        <!-- Main Primary Card (Total Distance) -->
        <div class="bg-black w-full p-2 flex items-center justify-between rounded-sm text-white">
          <div class="flex items-center gap-2 font-medium">
            <iconify-icon icon="tabler:trending-up" width="24" height="24"></iconify-icon>
            Total Distance
          </div>
          <div>
            <span class="text-2xl font-semibold tracking-wider">${totalDistKm}<span class="text-zinc-300 text-xl ml-1">km</span></span>
          </div>
        </div>

        <!-- Secondary Outlined Card (Total Points) -->
        <div class="bg-zinc-100 border-black border-2 text-black w-full p-2 flex items-center justify-between rounded-sm">
          <div class="flex items-center gap-2 font-medium">
            <iconify-icon icon="tabler:map-pin" width="24" height="24"></iconify-icon>
            Location Updates
          </div>
          <div>
            <span class="text-2xl font-semibold tracking-wider">${totalPoints}<span class="text-zinc-600 text-xl ml-1">pts</span></span>
          </div>
        </div>

        <!-- Two cards in a row (Start Time & End Time) with 2 rows: icon + title on top, value centered on bottom -->
        <div class="flex items-center gap-2">
          <div class="bg-zinc-100 w-full p-2 flex flex-col items-center justify-center rounded-sm">
            <div class="flex items-center text-zinc-600 gap-1.5 font-medium text-xs">
              <iconify-icon icon="tabler:clock" width="16" height="16"></iconify-icon>
              <span>Start Time</span>
            </div>
            <div class="text-center mt-1">
              <span class="text-xl font-semibold tracking-wider">${startTime}</span>
            </div>
          </div>
          <div class="bg-zinc-100 w-full p-2 flex flex-col items-center justify-center rounded-sm">
            <div class="flex items-center text-zinc-600 gap-1.5 font-medium text-xs">
              <iconify-icon icon="tabler:clock" width="16" height="16"></iconify-icon>
              <span>End Time</span>
            </div>
            <div class="text-center mt-1">
              <span class="text-xl font-semibold tracking-wider">${endTime}</span>
            </div>
          </div>
        </div>

        <!-- Date banner card -->
        <div class="bg-zinc-100 w-full p-2 flex items-center justify-between rounded-sm">
          <div class="flex items-center text-zinc-600 gap-2 font-medium text-xs">
            <iconify-icon icon="tabler:calendar" width="20" height="20"></iconify-icon>
            Report Date
          </div>
          <div>
            <span class="text-sm font-semibold tracking-wider">${formattedDate}</span>
          </div>
        </div>

        <!-- Map Section (Top) -->
        <div class="w-full border-2 border-black rounded-sm overflow-hidden mt-3">
          <div class="bg-black text-white px-2.5 py-1.5 flex items-center gap-2 text-xs font-medium">
            <iconify-icon icon="tabler:route" width="18" height="18"></iconify-icon>
            Route Map
          </div>
          <div id="map-container" class="w-full h-[220px] bg-zinc-100 [&_.leaflet-tile-pane]:grayscale [&_.leaflet-tile-pane]:contrast-125 [&_.leaflet-tile-pane]:brightness-105"></div>
        </div>

        <!-- Graphs Section (Bottom) with Chart.js -->
        <div class="space-y-2 pt-2">
          ${charts
            .map(
              c => `
            <div class="bg-zinc-100 w-full p-2 rounded-sm border border-zinc-300">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-1.5 text-xs font-medium text-zinc-900">
                  <iconify-icon icon="${c.icon}" width="16" height="16"></iconify-icon>
                  <span>${c.title}</span>
                </div>
                <div class="text-[11px] font-mono text-zinc-600">
                  Avg: <span class="font-semibold text-zinc-900">${c.avgVal}${c.unit}</span> &bull; Max: <span class="font-semibold text-zinc-900">${c.maxValStr}${c.unit}</span>
                </div>
              </div>
              <div class="w-full h-[90px] bg-white border border-black rounded-xs p-1">
                <canvas id="chart-${c.id}"></canvas>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="border-t-2 mt-4 border-zinc-800 flex items-center justify-center p-2 text-xs">
        <p class="text-zinc-500">[Computer Generated Report]</p>
      </div>

      <script>
        (function() {
          // 1. Leaflet Map
          const coords = ${coordsJSON};
          if (coords && coords.length > 0) {
            const map = L.map('map-container', {
              zoomControl: false,
              attributionControl: false
            });

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 18
            }).addTo(map);

            const polyline = L.polyline(coords, {
              color: '#000000',
              weight: 3,
              opacity: 1
            }).addTo(map);

            L.circleMarker(coords[0], {
              radius: 5,
              fillColor: '#ffffff',
              color: '#000000',
              weight: 2,
              opacity: 1,
              fillOpacity: 1
            }).addTo(map);

            if (coords.length > 1) {
              L.circleMarker(coords[coords.length - 1], {
                radius: 5,
                fillColor: '#000000',
                color: '#000000',
                weight: 2,
                opacity: 1,
                fillOpacity: 1
              }).addTo(map);
            }

            map.fitBounds(polyline.getBounds(), { padding: [15, 15] });
          }

          // 2. Chart.js Graphs
          const chartConfigs = ${chartsJSON};
          chartConfigs.forEach(function(cfg) {
            const canvas = document.getElementById('chart-' + cfg.id);
            if (!canvas) return;

            new Chart(canvas, {
              type: 'line',
              data: {
                labels: cfg.labels,
                datasets: [{
                  data: cfg.data,
                  borderColor: '#000000',
                  borderWidth: 1.5,
                  fill: true,
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  tension: 0.2,
                  pointRadius: 0
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: false }
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: {
                      color: '#52525b',
                      font: { size: 9, family: 'monospace' },
                      maxTicksLimit: 5,
                      autoSkip: true
                    }
                  },
                  y: {
                    min: cfg.min,
                    max: cfg.max,
                    grid: {
                      color: '#e4e4e7',
                      borderDash: [3, 3]
                    },
                    ticks: {
                      color: '#52525b',
                      font: { size: 9, family: 'monospace' },
                      maxTicksLimit: 4
                    }
                  }
                }
              }
            });
          });
        })();
      </script>
    </body>
    </html>
  `
}
