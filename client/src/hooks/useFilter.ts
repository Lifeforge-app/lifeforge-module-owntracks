import dayjs from 'dayjs'
import { parseAsString, useQueryStates } from 'nuqs'

export default function useFilter() {
  const [filter, setFilter] = useQueryStates({
    date: parseAsString.withDefault(dayjs().format('YYYY-MM-DD'))
  })

  function updateFilter<K extends keyof typeof filter>(
    keyOrUpdates: K | Partial<typeof filter>,
    value?: (typeof filter)[K]
  ) {
    if (typeof keyOrUpdates === 'string') {
      setFilter(prev => ({
        ...prev,
        [keyOrUpdates]: value
      }))
    } else {
      setFilter(prev => ({
        ...prev,
        ...keyOrUpdates
      }))
    }
  }

  return {
    ...filter,
    updateFilter
  }
}
