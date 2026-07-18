import { useQuery } from '@tanstack/react-query'
import { APIProvider, AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import { type InferOutput } from '@lifeforge/api'
import {
  Box,
  DateInput,
  EmptyStateScreen,
  ModuleHeader,
  WithQuery,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

type LocationRecord = InferOutput<typeof forgeAPI.locations.list>[number]

function Owntracks() {
  const { derivedTheme } = usePersonalization()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const locationsQuery = useQuery(
    forgeAPI.locations.list
      .input({
        date: dayjs(selectedDate ?? undefined).format('YYYY-MM-DD')
      })
      .queryOptions({ enabled: selectedDate !== null, refetchInterval: 30000 })
  )

  const googleMapAPIKeyQuery = useQuery(
    forgeAPI.getAPIKeys({ keyId: 'gcloud' }).queryOptions({ retry: false })
  )

  const locations = locationsQuery.data ?? []

  const centerPoint = useMemo(() => {
    if (locations.length === 0) return { lat: 0, lng: 0 }

    const avgLat =
      locations.reduce(
        (sum, location: LocationRecord) => sum + location.lat,
        0
      ) / locations.length

    const avgLng =
      locations.reduce(
        (sum, location: LocationRecord) => sum + location.lon,
        0
      ) / locations.length

    return { lat: avgLat, lng: avgLng }
  }, [locations])

  return (
    <>
      <ModuleHeader />
      <Box mb="md">
        <DateInput
          icon="tabler:calendar"
          label="date"
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </Box>
      <WithQuery query={googleMapAPIKeyQuery} showRetryButton={false}>
        {googleMapAPIKey =>
          googleMapAPIKey ? (
            <WithQuery query={locationsQuery}>
              {() =>
                locations.length > 0 ? (
                  <APIProvider apiKey={googleMapAPIKey}>
                    <Map
                      key={dayjs(selectedDate ?? undefined).format(
                        'YYYY-MM-DD'
                      )}
                      colorScheme={derivedTheme === 'dark' ? 'DARK' : 'LIGHT'}
                      defaultCenter={centerPoint}
                      defaultZoom={13}
                      mapId="OwntracksMap"
                      style={{
                        width: '100%',
                        height: '100%',
                        flex: 1,
                        borderRadius: 'var(--radius-lg)'
                      }}
                    >
                      {locations.map((location: LocationRecord, index) => (
                        <AdvancedMarker
                          key={index}
                          position={{
                            lat: location.lat,
                            lng: location.lon
                          }}
                        >
                          <Box
                            bg="primary"
                            height="16px"
                            r="full"
                            style={{
                              border: '2px solid white'
                            }}
                            title={dayjs.unix(location.tst).format('HH:mm:ss')}
                            width="16px"
                          />
                        </AdvancedMarker>
                      ))}
                    </Map>
                  </APIProvider>
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
          ) : (
            <EmptyStateScreen
              icon="tabler:key-off"
              message={{
                id: 'mapKey'
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default Owntracks
