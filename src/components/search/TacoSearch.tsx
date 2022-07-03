import * as React from 'react'
import { useEffect, useState } from 'react'
import SearchInput from './SearchInput'
import SearchResults from './SearchResults'
import useSearch from './useSearch'

/**
 * Search through multiple data-sources at once and present the unified
 * results to the user.
 */
export default function TacoSearch (): JSX.Element {
  const { results, setQuery, areas, loading } = useSearch()
  const [hideResults, setHide] = useState(false)

  useEffect(() => {
    document.addEventListener('click', outsideClickDetector)
    return () => { document.removeEventListener('click', outsideClickDetector) }
  }, [])

  useEffect(() => setHide(false), [results])

  const outsideClickDetector = (event: any): void => {
    const searchDiv = document.getElementById('searchPanel')
    if (searchDiv === null) return
    const withinBoundaries: boolean = event.composedPath().includes(searchDiv)

    if (!withinBoundaries) {
      setHide(true)
    } else {
      setHide(false)
    }
  }

  return (
    <div className='relative w-full' id='searchPanel'>
      <div>
        <SearchInput
          loading={loading}
          onChange={setQuery}
        />
      </div>

      <div className='flex justify-center relative'>
        <div
          style={{ zIndex: '50' }}
          className=' w-screen md:w-full p-2 md:p-0 md:mt-4 absolute'
        >
          <SearchResults
            areas={areas}
            results={results}
            hide={hideResults}
          />
        </div>
      </div>
    </div>
  )
}
