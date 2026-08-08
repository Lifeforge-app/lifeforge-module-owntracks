import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'

import { type InferOutput } from '@lifeforge/api'

import useFilter from '@/hooks/useFilter'
import { forgeAPI } from '@/manifest'

type LocationRecord = InferOutput<typeof forgeAPI.locations.list>[number]

interface IMapPageData {
  date: string
  updateFilter: ReturnType<typeof useFilter>['updateFilter']
  selectedTime: number
  setSelectedTime: React.Dispatch<React.SetStateAction<number>>
  sliderValue: number
  minTst: number
  maxTst: number
  locations: LocationRecord[]
  currentLocation: LocationRecord | null
  locationsQuery: UseQueryResult<LocationRecord[]>
}

export const MapPageContext = createContext<IMapPageData | undefined>(undefined)

export function MapPageProvider({ children }: { children: React.ReactNode }) {
  const { date, updateFilter } = useFilter()
  const [selectedTime, setSelectedTime] = useState(0)

  const locationsQuery = useQuery(
    forgeAPI.locations.list
      .input({
        date
      })
      .queryOptions({ enabled: !!date, refetchInterval: 30000 })
  )

  const locations = locationsQuery.data ?? []

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

  const value = useMemo(
    () => ({
      date,
      updateFilter,
      selectedTime,
      setSelectedTime,
      sliderValue,
      minTst,
      maxTst,
      locations,
      currentLocation,
      locationsQuery
    }),
    [
      date,
      updateFilter,
      selectedTime,
      sliderValue,
      minTst,
      maxTst,
      locations,
      currentLocation,
      locationsQuery
    ]
  )

  return <MapPageContext value={value}>{children}</MapPageContext>
}

export function useMapPageContext(): IMapPageData {
  const context = useContext(MapPageContext)

  if (context === undefined) {
    throw new Error('useMapPageContext must be used within a MapPageProvider')
  }

  return context
}
