import React from 'react'
import { mouthsMap } from './all'

const mouthKeys = [
  'big_smile',
  'flat',
  'laugh_open',
  'mischief',
  'open',
  'open_happy',
  'open_tongue',
  'sad',
  'side_smile',
  'smile',
  'soft_smile',
  'surprised',
  'talking',
  'tongue',
  'wave',
  'wave_small'
]

describe('mouthsMap', () => {
  it('expõe todas as bocas esperadas', () => {
    expect(Object.keys(mouthsMap).sort()).toEqual(mouthKeys.sort())
  })

  it('retorna componentes renderizáveis', () => {
    mouthKeys.forEach((key) => {
      const Component = mouthsMap[key as keyof typeof mouthsMap]
      const element = React.createElement(Component)
      expect(React.isValidElement(element)).toBe(true)
    })
  })
})
