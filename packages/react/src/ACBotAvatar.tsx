import ACBotFace from './ACBotFace'
import ACBotShape from './ACBotShape'
import { hexToHsl } from '@ac-andrade/ac-bot-avatar-utils'
import type { ACBotAvatarProps } from '@ac-andrade/ac-bot-avatar-core/dist/types'

export const ACBotAvatar = ({
  background,
  backgroundType,
  backgroundColors,
  backgroundRotation,
  maxSize,
  color,
  face,
  eye,
  mouth,
  size,
  style,
  variant = 'robot',
  ...rest
}: ACBotAvatarProps) => {
  let hslColor: [number, number, number] | undefined

  if (Array.isArray(color)) {
    hslColor = color
  } else if (typeof color === 'string') {
    hslColor = hexToHsl(color)
  }

  // Handle maxSize limiting
  let finalSize = size === 'inherit' ? '100%' : size === undefined ? 200 : size
  if (typeof finalSize === 'number' && maxSize !== undefined && finalSize > maxSize) {
    finalSize = maxSize
  }

  return (
    <svg
      version='1.1'
      baseProfile='tiny'
      x='0px'
      y='0px'
      viewBox='-25 -25 350 350'
      overflow='visible'
      width={finalSize}
      style={{
        ...style,
        color: hslColor ? `hsl(${hslColor[0]}, ${hslColor[1]}%, ${hslColor[2]}%)` : 'inherit'
      }}
      preserveAspectRatio='none'
    >
      <ACBotShape
        h={hslColor ? hslColor[0] : undefined}
        s={hslColor ? hslColor[1] : undefined}
        l={hslColor ? hslColor[2] : undefined}
        background={background}
        backgroundType={backgroundType}
        backgroundColors={backgroundColors}
        backgroundRotation={backgroundRotation}
        variant={variant}
      />
      <ACBotFace
        face={face}
        eye={eye}
        mouth={mouth}
        eyeColor={rest.eyeColor}
        mouthColor={rest.mouthColor}
        variant={variant}
      />
    </svg>
  )
}

export default ACBotAvatar
