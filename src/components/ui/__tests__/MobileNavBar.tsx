import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import MobileNavBar from '../MobileNavBar'

test('MNavBar mobile', () => {
  const element = render(
    <MobileNavBar
      home={<div>home</div>}
      branding={<div>logo</div>}
      profile={<div>profile</div>}
      more={<div>more</div>}
    />
  )

  expect(element.getByText('home'))
    .toHaveTextContent('home')
  expect(element.getByText('logo'))
    .toHaveTextContent('logo')
  expect(element.getByText('profile'))
    .toHaveTextContent('profile')
  expect(element.getByText('more'))
    .toHaveTextContent('more')
})
