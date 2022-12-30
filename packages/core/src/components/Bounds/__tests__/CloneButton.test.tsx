import { screen } from '@testing-library/react'
import * as React from 'react'
import { renderWithContext } from '~test'
import { CloneButton } from '../CloneButton'

jest.spyOn(console, 'error').mockImplementation(() => void null)

describe('CloneButton', () => {
  test('mounts component without crashing', () => {
    expect(() =>
      renderWithContext(
        <CloneButton
          size={10}
          targetSize={20}
          bounds={{ minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 }}
          side="top"
        />
      )
    ).not.toThrowError()
  })
  test('validate attributes for clone button', () => {
    renderWithContext(
      <CloneButton
        size={10}
        targetSize={20}
        bounds={{ minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 }}
        side="top"
      />
    )

    const cloneBtn = screen.getByLabelText('clone button')

    expect(cloneBtn).toHaveAttribute('transform', 'translate(30, -80)')

    // transparent rect
    const rect = cloneBtn.querySelector('rect')

    expect(rect).toHaveAttribute('height', '40')
    expect(rect).toHaveAttribute('width', '40')

    expect(cloneBtn.querySelector('g')).toHaveAttribute(
      'transform',
      'translate(20, 20) rotate(270)'
    )
    expect(cloneBtn.querySelector('circle')).toHaveAttribute('r', '20')
    expect(cloneBtn.querySelector('path')).toHaveAttribute('d', 'M -5,-5 L 5,0 -5,5 Z')
  })
})
