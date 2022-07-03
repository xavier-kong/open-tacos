import { useState, useEffect } from 'react'
import { geocoderLookup } from '../../js/mapbox/Client'
import { multiSearch } from '../../js/typesense/TypesenseClient'

export interface Result {
  /**
   * The areanames represnt the path down to this climb.
   * ["US", "Kentucky", "Red River Gorge", … ]
   * US / Kentucky / Red River Gorge / …
   */
  areaNames: string[]
  climbName: string
  climbUUID: string
  fa: string
  cragLatLng: [number, number]
  disciplines: string[]
  grade: string
  id: string
  safety: string
}

const SEARCH_OPTIONS = {
  region: 'poi,place,region'
}

export interface Results {
  climbs: Result[]
  areas: Result[]
  fa: Result[]
}

export interface AreaResult {
  place_name: string
  text: string
  id: string
  center: [number, number]
}

interface useSearchOut {
  loading: boolean
  query: String
  setQuery: React.Dispatch<React.SetStateAction<String>>
  results: Results | null
  areas: AreaResult[] | null
}

export default function useSearch (): useSearchOut {
  const [query, setQuery] = useState('')
  const [_lastQuery, _setLastQuery] = useState('')
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(false)
  const [areas, setAreas] = useState<AreaResult[] | null>(null)

  /**
   * We place two seperate queries largely because we are asking
   * for two discrete data observations. We resolve these two queries
   * independantly, essentially allowing whichever query was lighter
   * to get pushed to the user first.
   */
  function makeSearch (query: string): void {
    // This will do a couple of things, but almost most importantly it will
    // cut down on needless queries due to whitespace queries
    const sanitizeQuery = query
      .trim()
      .split(' ')
      .filter(i => i !== '')
      .join(' ')

    // Guard against making identical queries.
    if (_lastQuery === sanitizeQuery) {
      return
    }

    _setLastQuery(sanitizeQuery)

    multiSearch(sanitizeQuery)
      .then(r => {
        setResults(r)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setResults(null)
      })

    geocoderLookup(query, SEARCH_OPTIONS)
      .then(i => {
        setAreas(i as any)
        setLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    // guard query appropriateness before proceeding
    if (query.length < 3 || query.replaceAll(' ', '').length < 3) {
      setResults(null)
      _setLastQuery('')
      setLoading(false)
      return
    }

    setLoading(true)
    const tm = setTimeout(() => makeSearch(query), 275)

    return () => {
      // If effect interrupts, canel the pending query and clear the timeout
      clearTimeout(tm)
    }
  }, [query])

  return { loading, query, results, areas, setQuery }
}
