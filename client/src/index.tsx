import dayjs from 'dayjs'
import { useState } from 'react'

import {
  Box,
  ContextMenu,
  ContextMenuItem,
  DateInput,
  EmptyStateScreen,
  ModuleHeader,
  Scrollbar,
  SliderInput,
  Stack,
  WithQuery,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import OSMMap from './components/OSMMap'
import TelemetryWidget from './components/TelemetryWidget'
import { MapPageProvider, useMapPageContext } from './contexts/MapPageProvider'

function LocationsMapContent() {
  const {
    date,
    updateFilter,
    setSelectedTime,
    sliderValue,
    minTst,
    maxTst,
    locations,
    locationsQuery
  } = useMapPageContext()

  const [downloading, setDownloading] = useState(false)

  async function handleDownloadImage() {
    setDownloading(true)

    try {
      const response = await forgeAPI.locations.image.input({ date }).query()

      const blob =
        response instanceof Blob
          ? response
          : new Blob([response as BlobPart], { type: 'image/png' })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `owntracks-${date}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to generate summary image')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <ModuleHeader
        icon="tabler:map-pin"
        title="Map"
        trailing={
          <ContextMenu>
            <ContextMenuItem
              icon="tabler:download"
              label="downloadImage"
              loading={downloading}
              shouldCloseMenuOnClick={false}
              onClick={handleDownloadImage}
            />
          </ContextMenu>
        }
      />
      <Box mb="md">
        <DateInput
          icon="tabler:calendar"
          label="date"
          value={dayjs(date).toDate()}
          onChange={(newDate: Date | null) => {
            updateFilter(
              'date',
              newDate
                ? dayjs(newDate).format('YYYY-MM-DD')
                : dayjs().format('YYYY-MM-DD')
            )
            setSelectedTime(0)
          }}
        />
      </Box>

      <WithQuery query={locationsQuery}>
        {() =>
          locations.length > 0 ? (
            <Stack height="100%" minHeight="0">
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
              <Scrollbar>
                <Stack mb="lg">
                  <OSMMap />
                  <TelemetryWidget
                    dataKey="alt"
                    filterPredicate={val => val !== 0}
                    icon="tabler:mountain"
                    title="Altitude"
                    unit="m"
                  />
                  <TelemetryWidget
                    dataKey="batt"
                    domain={[0, 100]}
                    icon="tabler:battery"
                    title="Battery"
                    unit="%"
                  />
                  <TelemetryWidget
                    dataKey="vel"
                    icon="tabler:gauge"
                    title="Speed"
                    unit="km/h"
                  />
                  <TelemetryWidget
                    dataKey="acc"
                    icon="tabler:target"
                    title="Accuracy"
                    unit="m"
                  />
                  <TelemetryWidget
                    dataKey="vac"
                    filterPredicate={val => val > 0}
                    icon="tabler:ruler-measure"
                    title="Vertical Accuracy"
                    unit="m"
                  />
                  <TelemetryWidget
                    dataKey="p"
                    filterPredicate={val => val > 0}
                    icon="tabler:gauge-filled"
                    title="Pressure"
                    unit="kPa"
                  />
                  <TelemetryWidget
                    dataKey="cog"
                    domain={[0, 360]}
                    icon="tabler:compass"
                    title="Heading"
                    unit="°"
                  />
                  <TelemetryWidget
                    dataKey="rad"
                    filterPredicate={val => val > 0}
                    icon="tabler:circle-dashed"
                    title="Radius"
                    unit="m"
                  />
                </Stack>
              </Scrollbar>
            </Stack>
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

function LocationsMap() {
  return (
    <MapPageProvider>
      <LocationsMapContent />
    </MapPageProvider>
  )
}

export default LocationsMap
