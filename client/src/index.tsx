import dayjs from 'dayjs'

import {
  Box,
  DateInput,
  EmptyStateScreen,
  ModuleHeader,
  Scrollbar,
  SliderInput,
  Stack,
  WithQuery
} from '@lifeforge/ui'

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

  return (
    <>
      <ModuleHeader icon="tabler:map-pin" title="Map" />
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
