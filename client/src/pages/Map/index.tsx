import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
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
  DateInput,
  EmptyStateScreen,
  ModuleHeader,
  SliderInput,
  Text,
  Widget,
  WithQuery,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import OSMMap from './components/OSMMap'

type LocationRecord = InferOutput<typeof forgeAPI.locations.listCoords>[number]

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

function LocationsMap() {
  const { derivedThemeColor } = usePersonalization()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedTime, setSelectedTime] = useState(0)

  const locationsQuery = useQuery(
    forgeAPI.locations.listCoords
      .input({
        date: dayjs(selectedDate ?? undefined).format('YYYY-MM-DD')
      })
      .queryOptions({ enabled: selectedDate !== null, refetchInterval: 30000 })
  )

  const locations = locationsQuery.data ?? []

  const tracestrackKeyQuery = useQuery(
    forgeAPI.getAPIKeys({ keyId: 'tracestrack' }).queryOptions({ retry: false })
  )

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

  const minTst = locations.length > 0 ? locations[0].tst : 0

  const maxTst = locations.length > 0 ? locations[locations.length - 1].tst : 0

  const sliderValue = Math.min(Math.max(selectedTime, minTst), maxTst)

  const currentLocation = useMemo(() => {
    if (locations.length === 0) return null

    return locations.reduce(
      (closest: LocationRecord, location: LocationRecord) =>
        Math.abs(location.tst - sliderValue) <
        Math.abs(closest.tst - sliderValue)
          ? location
          : closest
    )
  }, [locations, sliderValue])

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
    <>
      <ModuleHeader icon="tabler:map-pin" title="Map" />
      <Box mb="md">
        <DateInput
          icon="tabler:calendar"
          label="date"
          value={selectedDate}
          onChange={(date: Date | null) => {
            setSelectedDate(date)
            setSelectedTime(0)
          }}
        />
      </Box>
      <WithQuery query={locationsQuery}>
        {() =>
          locations.length > 0 ? (
            <>
              <Box mb="md">
                <SliderInput
                  icon="tabler:clock"
                  label="time"
                  max={maxTst}
                  min={minTst}
                  renderValue={value => dayjs.unix(value).format('HH:mm:ss')}
                  step={1}
                  value={sliderValue}
                  onChange={setSelectedTime}
                />
              </Box>
              <Widget flex="1" icon="tabler:route" minHeight="0" title="Route">
                <WithQuery
                  query={tracestrackKeyQuery}
                  showRetryButton={false}
                >
                  {apiKey => (
                    <OSMMap
                      apiKey={apiKey || null}
                      currentLocation={currentLocation}
                      locations={locations}
                    />
                  )}
                </WithQuery>
              </Widget>
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
                              tickFormatter={value =>
                                dayjs.unix(value).format('HH:mm')
                              }
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
            </>
          ) : (
            <EmptyStateScreen
              icon="tabler:map-pin-off"
              message={{
                id: 'records'
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default LocationsMap
