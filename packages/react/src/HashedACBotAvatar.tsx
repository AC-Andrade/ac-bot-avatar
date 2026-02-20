import { useMemo } from 'react'
import { ACBotAvatar } from './ACBotAvatar'
import { generateAvatarConfig } from '@ac-andrade/ac-bot-avatar-utils'
import type { HashedACBotAvatarProps } from '@ac-andrade/ac-bot-avatar-core'

/**
 * A wrapper around ACBotAvatar that generates its configuration deterministically
 * based on an identifier and optional gender.
 */
export const HashedACBotAvatar = ({
    identifier,
    gender,
    ...props
}: HashedACBotAvatarProps) => {
    const generatedProps = useMemo(() => {
        if (!identifier) return {}
        return generateAvatarConfig(identifier.toString(), gender)
    }, [identifier, gender])

    return (
        <ACBotAvatar
            {...generatedProps}
            {...props}
        />
    )
}

export default HashedACBotAvatar
