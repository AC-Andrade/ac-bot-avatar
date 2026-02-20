import React, { useMemo } from 'react'
import { eyes, mouths } from '@ac-andrade/ac-bot-avatar-assets'
import type { ACBotFaceProps, Face } from '@ac-andrade/ac-bot-avatar-core'

const legacyFaceMap = {
  cool: { eye: 'sunglasses', mouth: 'side_smile' },
  normal: { eye: 'normal', mouth: 'smile' },
  wink: { eye: 'blink', mouth: 'smile' },
  love: { eye: 'love', mouth: 'smile' },
  scheming: { eye: 'mischief', mouth: 'mischief' },
  grinning: { eye: 'laugh', mouth: 'big_smile' },
  shiny: { eye: 'star', mouth: 'smile' },
  crying: { eye: 'cry_laugh', mouth: 'sad' },
  stars: { eye: 'star', mouth: 'laugh_open' },
  speaking: { eye: 'talking', mouth: 'talking' },
  music: { eye: 'music', mouth: 'smile' },
  shocked: { eye: 'surprised', mouth: 'surprised' },
  lines: { eye: 'squint', mouth: 'flat' }
}

const ACBotFace = ({ face, eye, mouth, eyeColor, mouthColor, variant }: ACBotFaceProps) => {
  const { finalEye, finalMouth } = useMemo(() => {
    const legacy = face ? (legacyFaceMap as Record<Face, any>)[face] : undefined
    return {
      finalEye: eye || legacy?.eye || 'normal',
      finalMouth: mouth || legacy?.mouth || 'smile'
    }
  }, [face, eye, mouth])

  return (
    <g
      id='bot-face'
      transform="translate(9, 40) scale(0.085)"
      style={variant === 'face' ? { filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.15))' } : undefined}
    >
      <g transform="translate(0, -120)">
        {Boolean((eyes as any)[finalEye]) && React.createElement((eyes as any)[finalEye], {
          style: eyeColor ? { color: eyeColor } : undefined
        })}
      </g>
      <g transform="translate(0, 160)">
        {Boolean((mouths as any)[finalMouth]) && React.createElement((mouths as any)[finalMouth], {
          style: mouthColor ? { color: mouthColor } : undefined
        })}
      </g>
    </g>
  )
}

export default ACBotFace
