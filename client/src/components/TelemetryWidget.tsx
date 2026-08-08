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
  usePersonalization
} from '@lifeforge/ui'

import { useMapPageContext } from '@/contexts/MapPageProvider'
import { forgeAPI } from '@/manifest'

type LocationRecord = InferOutput<typeof forgeAPI.locations.list>[number]

function TelemetryTooltip({
  active,
  payload,
  label,
  unit,
  formatter
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: number
  unit: string
  formatter?: (value: number) => string
}) {
  if (active && payload && payload.length) {
    const rawValue = payload[0].value
    const displayValue = formatter ? formatter(rawValue) : `${rawValue} ${unit}`

    return (
      <Card p="md">
        <Text color="muted" mb="xs" weight="medium">
          {dayjs.unix(Number(label)).format('HH:mm:ss')}
        </Text>
        <Text size="lg" weight="semibold">
          {displayValue}
        </Text>
      </Card>
    )
  }

  return null
}

export function TelemetryWidget({
  title,
  icon,
  dataKey,
  unit,
  domain = ['auto', 'auto'],
  formatter,
  filterPredicate
}: {
  title: string
  icon: string
  dataKey: keyof LocationRecord
  unit: string
  domain?: [number | 'auto' | 'dataMin' | 'dataMax', number | 'auto' | 'dataMin' | 'dataMax']
  formatter?: (value: number) => string
  filterPredicate?: (value: number) => boolean
}) {
  const { locations, sliderValue } = useMapPageContext()
  const { derivedThemeColor } = usePersonalization()

  const chartData = useMemo(() => {
    return locations
      .filter(location => {
        const val = location[dataKey]
        if (typeof val !== 'number') return false
        if (filterPredicate) return filterPredicate(val)
        return true
      })
      .map(location => ({
        tst: location.tst,
        value: location[dataKey] as number
      }))
  }, [locations, dataKey, filterPredicate])

  const currentPoint = useMemo(() => {
    if (chartData.length === 0) return null

    return chartData.reduce((closest, point) =>
      Math.abs(point.tst - sliderValue) < Math.abs(closest.tst - sliderValue)
        ? point
        : closest
    )
  }, [chartData, sliderValue])

  if (chartData.length === 0) {
    return null
  }

  return (
    <Widget
      height="20rem"
      icon={icon}
      title={title}
      width="100%"
    >
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
              dataKey="tst"
              domain={['dataMin', 'dataMax']}
              tick={{ fill: 'currentColor' }}
              tickFormatter={value => dayjs.unix(value).format('HH:mm')}
              tickLine={false}
              type="number"
            />
            <YAxis
              axisLine={false}
              domain={domain}
              tick={{ fill: 'currentColor' }}
              tickFormatter={value =>
                formatter ? formatter(value) : `${value} ${unit}`
              }
              tickLine={false}
            />
            <Tooltip
              content={props => (
                <TelemetryTooltip
                  {...props}
                  formatter={formatter}
                  unit={unit}
                />
              )}
            />
            <Line
              activeDot={{
                r: 6,
                fill: derivedThemeColor,
                stroke: derivedThemeColor
              }}
              dataKey="value"
              dot={false}
              stroke={derivedThemeColor}
              strokeWidth={2}
              type="monotone"
            />
            {currentPoint && (
              <ReferenceDot
                fill={derivedThemeColor}
                r={6}
                stroke="white"
                strokeWidth={2}
                x={currentPoint.tst}
                y={currentPoint.value}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Widget>
  )
}

export default TelemetryWidget
