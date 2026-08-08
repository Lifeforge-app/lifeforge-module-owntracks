import dayjs from 'dayjs'

import {
  Box,
  DateInput,
  EmptyStateScreen,
  ModuleHeader,
  Scrollbar,
  SliderInput,
  WithQuery
} from '@lifeforge/ui'

import {
  MapPageProvider,
  useMapPageContext
} from '@/pages/Map/contexts/MapPageProvider'

import AltitudeWidget from './components/AltitudeWidget'
import OSMMap from './components/OSMMap'

function LocationsMapContent() {
  const {
    selectedDate,
    setSelectedDate,
    setSelectedTime,
    sliderValue,
    minTst,
    maxTst,
    locations,
    locationsQuery
  } = useMapPageContext()

  return (
    <Scrollbar>
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
              <OSMMap />
              <AltitudeWidget />
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
    </Scrollbar>
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
