import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { PlaceTemplate } from './CragFinderTemplates'
import { AreaResult, Result, Results } from './useSearch'

interface SearchResultProps {
  results: Results | null
  hide: boolean
  areas: AreaResult[] | null
}

function ResultItem ({ result, href }: {result: Result, href: string}): JSX.Element {
  return (
    <Link href={href}>
      <div className='cursor-pointer whitespace-nowrap p-2 rounded-lg
          hover:shadow transition-colors hover:border-gray-500 border-white border'
      >
        <div>
          {result.climbName}
          <div className='text-xs text-gray-500 '>
            {result.areaNames[1]}, {result.areaNames[result.areaNames.length - 1]}
          </div>
        </div>

        <div className='flex text-xs text-white'>
          {result.disciplines.map(dis => (
            <div key={dis}>
              <div className='bg-orange-700  rounded-lg mr-1 p-1 px-2 text-center'>
                {dis}
              </div>
            </div>
          ))}

          <div>
            <div className='bg-slate-800 rounded-lg p-1 px-2 text-center'>
              {result.grade}
            </div>
          </div>

        </div>

      </div>
    </Link>
  )
}

export default function SearchResults ({ results, hide, areas }: SearchResultProps): JSX.Element {
  const hidden = results === null || hide
  const router = useRouter()
  const noData = (results?.climbs.length === 0 &&
    results?.areas.length === 0 &&
    areas?.length === 0)

  return (
    <div
      style={{
        maxHeight: hidden ? '0px' : '400px',
        overflow: hidden ? 'hidden' : 'auto',
        transition: 'max-height 0.2s ease-out'
      }}
      className='rounded-lg'
    >

      {results !== null
        ? (
          <div className='p-4 border shadow-lg bg-white rounded-lg'>
            {!noData
              ? (
                <>
                  <h4 className='pt-2 mt-2 text-center text-slate-700'>Climbs</h4>
                  <div>
                    {results.climbs.map(c => (
                      <ResultItem key={c.climbUUID} result={c} href={`/climbs/${c.climbUUID}`} />
                    ))}
                  </div>

                  <h4 className='pt-2 mt-2 text-center text-slate-700'>Area Relationship</h4>
                  {results.climbs.map(c => (
                    <ResultItem key={c.climbUUID} result={c} href={`/climbs/${c.climbUUID}`} />
                  ))}

                  {areas !== null
                    ? (
                      <>
                        <h4 className='pt-2 mt-2 text-center text-slate-700'>Climbs nearby to</h4>
                        {areas.map(item => (
                          <div key={item.id} className='hover:bg-gray-50 cursor-pointer'>
                            <PlaceTemplate
                              placeName={item.place_name}
                              shortName={item.text}
                              center={item.center}
                              placeId={item.id}
                              router={router}
                            />
                          </div>
                        ))}
                      </>
                      )
                    : ''}
                </>)
              : 'No results, perhaps try a different query?'}
          </div>
          )
        : ''}
    </div>
  )
}
