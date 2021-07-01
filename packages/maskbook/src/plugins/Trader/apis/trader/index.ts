import { safeUnreachable } from '@dimensiondev/kit'
import { getNetworkTypeFromChainId, NetworkType } from '@masknet/web3-shared'
import { currentChainIdSettings } from '../../../Wallet/settings'
import { TagType, TradeProvider } from '../../types'

export async function getAvailableTraderProviders(type?: TagType, keyword?: string) {
    const networkType = getNetworkTypeFromChainId(currentChainIdSettings.value)

    switch (networkType) {
        case NetworkType.Ethereum:
            return [
                TradeProvider.UNISWAP_V2,
                TradeProvider.UNISWAP_V3,
                TradeProvider.SUSHISWAP,
                TradeProvider.SASHIMISWAP,
                TradeProvider.ZRX,
                TradeProvider.BALANCER,
            ]
        case NetworkType.Polygon:
            return [TradeProvider.QUICKSWAP]
        case NetworkType.Binance:
            return [TradeProvider.PANCAKESWAP]
        default:
            safeUnreachable(networkType)
            return []
    }
}
