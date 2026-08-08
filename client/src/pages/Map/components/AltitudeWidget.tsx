import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { type InferOutput } from '@lifeforge/api'
import {
  Box,
  Card,
  Text,
  Widget,
  WithQuery,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { useMapPageContext } from '@/pages/Map/contexts/MapPageProvider'

type AltitudeRecord = InferOutput<
  typeof forgeAPI.locations.listAltitude
>[number]

function AltitudeTooltip({
  active,
  payload,
  label
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: number
}) {
  if (active && payload && payload.length) {
    return (
      <Card p="md">
        <Text color="muted" mb="xs" weight="medium">
          {dayjs.unix(Number(label)).format('HH:mm:ss')}
        </Text>
        <Text size="lg" weight="semibold">
          {payload[0].value} m
        </Text>
      </Card>
    )
  }

  return null
}

function AltitudeWidget() {
  const { selectedDate, sliderValue } = useMapPageContext()
  const { derivedThemeColor } = usePersonalization()

  const altitudesQuery = useQuery(
    forgeAPI.locations.listAltitude
      .input({
        date: dayjs(selectedDate ?? undefined).format('YYYY-MM-DD')
      })
      .queryOptions({ enabled: selectedDate !== null, refetchInterval: 30000 })
  )

  const altitudeChartData = useMemo(
    () =>
      (altitudesQuery.data ?? []).map((altitude: AltitudeRecord) => ({
        tst: altitude.tst,
        alt: altitude.alt
      })),
    [altitudesQuery.data]
  )

  const currentAltitude = useMemo(() => {
    const altitudes = altitudesQuery.data ?? []

    if (altitudes.length === 0) return null

    return altitudes.reduce(
      (closest: AltitudeRecord, altitude: AltitudeRecord) =>
        Math.abs(altitude.tst - sliderValue) <
        Math.abs(closest.tst - sliderValue)
          ? altitude
          : closest
    )
  }, [altitudesQuery.data, sliderValue])

  return (
    <WithQuery query={altitudesQuery}>
      {() =>
        altitudeChartData.length > 0 ? (
          <Widget
            height="20rem"
            icon="tabler:mountain"
            mt="md"
            title="Altitude"
            width="100%"
          >
            <Box flex="1" minHeight="0" width="100%">
              <ResponsiveContainer height="100%" width="100%">
                <LineChart data={altitudeChartData}>
                  <CartesianGrid
                    stroke="rgba(156, 163, 175, 0.2)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="tst"
                    domain={['dataMin', 'dataMax']}
                    tick={{ fill: 'currentColor' }}
                    tickFormatter={value => dayjs.unix(value).format('HH:mm')}
                    tickLine={false}
                    type="number"
                  />
                  <YAxis
                    axisLine={false}
                    domain={['auto', 'auto']}
                    tick={{ fill: 'currentColor' }}
                    tickFormatter={value => `${value} m`}
                    tickLine={false}
                  />
                  <Tooltip content={<AltitudeTooltip />} />
                  <Line
                    activeDot={{
                      r: 6,
                      fill: derivedThemeColor,
                      stroke: derivedThemeColor
                    }}
                    dataKey="alt"
                    dot={false}
                    stroke={derivedThemeColor}
                    strokeWidth={2}
                    type="monotone"
                  />
                  {currentAltitude && (
                    <ReferenceDot
                      fill={derivedThemeColor}
                      r={6}
                      stroke="white"
                      strokeWidth={2}
                      x={currentAltitude.tst}
                      y={currentAltitude.alt}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Widget>
        ) : (
          <></>
        )
      }
    </WithQuery>
  )
}

export default AltitudeWidget
