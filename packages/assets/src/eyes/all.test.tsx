import React from 'react'
import { eyesMap } from './all'

const eyeKeys = [
  'blink',
  'chords',
  'closed',
  'cry_laugh',
  'glasses',
  'glow',
  'heart',
  'laugh',
  'love',
  'mischief',
  'music',
  'normal',
  'squint',
  'star',
  'sunglasses',
  'surprised',
  'talking'
]

describe('eyesMap', () => {
  it('expõe todos os olhos esperados', () => {
    expect(Object.keys(eyesMap).sort()).toEqual(eyeKeys.sort())
  })

  it('retorna componentes renderizáveis', () => {
    eyeKeys.forEach((key) => {
      const Component = eyesMap[key as keyof typeof eyesMap]
      const element = React.createElement(Component)
      expect(React.isValidElement(element)).toBe(true)
    })
  })
})
