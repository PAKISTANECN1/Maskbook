import { useValueRef } from '@dimensiondev/maskbook-shared'
import { makeStyles } from '@material-ui/core'
import type { FC } from 'react'
import {
    currentSelectedWalletNetworkSettings,
    currentSelectedWalletProviderSettings,
} from '../../plugins/Wallet/settings'
import { NetworkIcon } from './NetworkIcon'
import { ProviderIcon } from './ProviderIcon'

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        display: 'flex',
    },
    mainIcon: {
        width: '100%',
        height: '100%',
    },
    badgeIcon: {
        position: 'absolute',
        right: -2,
        bottom: -2,
    },
}))

interface WalletIconProps {
    size?: number
    badgeSize?: number
}

export const WalletIcon: FC<WalletIconProps> = ({ size = 24, badgeSize = 14 }) => {
    const classes = useStyles()
    const selectedNetwork = useValueRef(currentSelectedWalletNetworkSettings)
    const selectedWalletProvider = useValueRef(currentSelectedWalletProviderSettings)
    return (
        <div
            className={classes.root}
            style={{
                height: size,
                width: size,
            }}>
            <NetworkIcon classes={{ icon: classes.mainIcon }} size={size} networkType={selectedNetwork} />
            <ProviderIcon
                classes={{ icon: classes.badgeIcon }}
                size={badgeSize}
                providerType={selectedWalletProvider}
            />
        </div>
    )
}
