import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
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
  Text,
  WithQuery,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

type LocationRecord = InferOutput<
  typeof forgeAPI.locations.listBattery
>[number]

function CustomTooltip({
  active,
  payload,
  label
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <Card p="md">
        <Text color="muted" mb="xs" weight="medium">
          {label}
        </Text>
        <Text size="lg" weight="semibold">
          {payload[0].value}%
        </Text>
      </Card>
    )
  }

  return null
}

function Battery() {
  const { derivedThemeColor } = usePersonalization()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const locationsQuery = useQuery(
    forgeAPI.locations.listBattery
      .input({
        date: dayjs(selectedDate ?? undefined).format('YYYY-MM-DD')
      })
      .queryOptions({ enabled: selectedDate !== null, refetchInterval: 30000 })
  )

  const chartData = useMemo(
    () =>
      (locationsQuery.data ?? []).map((location: LocationRecord) => ({
        time: dayjs.unix(location.tst).format('HH:mm'),
        batt: location.batt
      })),
    [locationsQuery.data]
  )

  return (
    <>
      <ModuleHeader icon="tabler:battery" title="Battery" />
      <Box mb="xl">
        <DateInput
          icon="tabler:calendar"
          label="date"
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </Box>
      <WithQuery query={locationsQuery}>
        {() =>
          chartData.length > 0 ? (
            <Box flex="1" minHeight="0" width="100%">
              <ResponsiveContainer height="100%" width="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    stroke="rgba(156, 163, 175, 0.2)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="time"
                    tick={{ fill: 'currentColor' }}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    domain={[0, 100]}
                    tick={{ fill: 'currentColor' }}
                    tickFormatter={value => `${value}%`}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    activeDot={{
                      r: 6,
                      fill: derivedThemeColor,
                      stroke: derivedThemeColor
                    }}
                    dataKey="batt"
                    dot={false}
                    stroke={derivedThemeColor}
                    strokeWidth={2}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <EmptyStateScreen
              icon="tabler:battery-off"
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

export default Battery
