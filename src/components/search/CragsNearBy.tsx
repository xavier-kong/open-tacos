import React from 'react'
import {
  gql,
  useQuery
} from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'

const GET_CRAGS_NEAR = gql`query CragsNear($placeId: String, $lng: Float, $lat: Float, $maxDistance: Int) {
    cragsNear(placeId: $placeId, lnglat: {lat: $lat, lng: $lng}, maxDistance: $maxDistance) {
        count
        _id
        placeId
    }
  }`

const CragsNearBy = ({ center, placeId }: {center: [number, number], placeId: string}): JSX.Element| null => {
  const { loading, data } = useQuery(GET_CRAGS_NEAR, {
    client: graphqlClient,
    variables: {
      placeId,
      lng: center[0],
      lat: center[1],
      maxDistance: 160000
    }
  })
  if (data === undefined || data.cragsNear.length === 0) {
    return (
      <div className='p-2 rounded-xl bg-gray-100 border-gray-500 border
    text-gray-600 text-center'
      >
        No climbs in this area :(
      </div>
    )
  }

  if (loading) {
    return (
      <div>{loading && 'loading'}</div>
    )
  }
  return (
    <CragDensity crags={data.cragsNear} />
  )
}

export default CragsNearBy

export const CragDensity = ({ crags }: {crags: any[]}): JSX.Element => {
  const total = crags.map(i => parseInt(i.count)).reduce((pS, a) => pS + a, 0)

  return (
    <div className='w-full border rounded-xl'>
      <div className='mt-2 w-full text-center'>Crags Nearby</div>
      <div className='flex items-end space-x-2 w-full px-3'>
        {crags.map(
          ({ _id, count }: {_id: string, count: number}) => {
            const p = (count / total) * 100

            return (
              <div key={_id} className='flex-1 relative'>
                <div className='absolute h-full w-full'>
                  <div style={{ height: `${100 - p}%` }} />
                  <div className='bg-gray-100' style={{ height: `${p}%` }} />
                </div>

                <div className='relative pt-4'>
                  <div className='text-center text-2xl'>{count}</div>
                  <div className='text-center pt-1 text-xs text-slate-500'>
                    {LABELS[_id].label}
                  </div>
                </div>

              </div>
            )
          })}
      </div>
    </div>
  )
}

export const LABELS = {
  0: {
    label: 'Under 30 miles',
    width: 4
  },
  48: {
    label: '30 - 60 miles',
    width: 8
  },
  96: {
    label: '60 - 100 miles',
    width: 16
  },
  160: {
    label: '100 - 150 miles',
    width: 16
  },
  theRest: {
    label: 'More than 150 miles',
    width: 20
  }
}
