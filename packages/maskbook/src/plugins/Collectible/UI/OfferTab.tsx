import { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import {
    Button,
    createStyles,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core'
import { OrderSide } from 'opensea-js/lib/types'
import { CollectibleState } from '../hooks/useCollectibleState'
import { useOrders } from '../hooks/useOrders'
import { CollectibleTab } from './CollectibleTab'
import { OrderRow } from './OrderRow'
import { TableListPagination } from './Pagination'
import { useI18N } from '../../../utils/i18n-next-ui'
import { CollectibleProvider } from '../types'
import { OfferTabActionBar } from './OfferTabActionBar'
import { LoadingTable } from './LoadingTable'
import { isSameAddress } from '../../../web3/helpers'
import { ChainState } from '../../../web3/state/useChainState'

const useStyles = makeStyles((theme) => {
    return createStyles({
        root: {
            overflow: 'auto',
        },
        content: {
            padding: '0 !important',
        },
        empty: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: theme.spacing(8, 0),
        },
        emptyCell: {
            borderStyle: 'none',
        },
        button: {
            marginLeft: theme.spacing(1),
        },
    })
})

export function OfferTab() {
    const { t } = useI18N()
    const classes = useStyles()

    const { account } = ChainState.useContainer()
    const { asset, token, provider } = CollectibleState.useContainer()

    const [page, setPage] = useState(0)
    const offers = useOrders(OrderSide.Buy, page)

    const isDifferenceToken = useMemo(() => {
        if (provider === CollectibleProvider.OPENSEA) {
            return (
                offers.value?.some(
                    (item) =>
                        (item.paymentTokenContract?.symbol !== 'WETH' && item.paymentTokenContract?.symbol !== 'ETH') ||
                        (item.quantity && new BigNumber(item.quantity).toString() !== '1'),
                ) && offers.value.filter((item) => new BigNumber(item.expirationTime ?? 0).isZero()).length === 0
            )
        } else {
            return false
        }
    }, [provider, offers.value])

    const dataSource = useMemo(() => {
        if (!offers.value || !offers.value?.length) return []
        return offers.value.sort((a, b) => {
            const current = new BigNumber(a.unitPrice)
            const next = new BigNumber(b.unitPrice)
            if (current.isLessThan(next)) {
                return 1
            } else if (current.isGreaterThan(next)) {
                return -1
            }
            return 0
        })
    }, [offers.value])

    if (offers.loading) return <LoadingTable />
    if (!offers.value || offers.error || !dataSource.length)
        return (
            <>
                <Table size="small">
                    <TableBody className={classes.empty}>
                        <TableRow>
                            <TableCell className={classes.emptyCell}>
                                <Typography color="textSecondary">{t('plugin_collectible_no_offers')}</Typography>
                                <Button
                                    sx={{
                                        marginTop: 1,
                                    }}
                                    variant="text"
                                    onClick={() => offers.retry()}>
                                    {t('plugin_collectible_retry')}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {asset.value?.owner?.address && !isSameAddress(asset.value.owner.address, account) ? (
                    <OfferTabActionBar />
                ) : null}
            </>
        )

    return (
        <CollectibleTab classes={{ root: classes.root, content: classes.content }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>{t('plugin_collectible_from')}</TableCell>
                        {isDifferenceToken ? (
                            <>
                                <TableCell>{t('plugin_collectible_unit_price')}</TableCell>
                                <TableCell>{t('plugin_collectible_quantity')}</TableCell>
                            </>
                        ) : (
                            <>
                                <TableCell>{t('plugin_collectible_price')}</TableCell>
                                <TableCell>{t('plugin_collectible_expiration')}</TableCell>
                            </>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataSource.map((order) => (
                        <OrderRow key={order.hash} order={order} isDifferenceToken={isDifferenceToken} />
                    ))}
                </TableBody>
                {(provider === CollectibleProvider.OPENSEA && dataSource.length) || page > 0 ? (
                    <TableListPagination
                        handlePrevClick={() => setPage((prev) => prev - 1)}
                        handleNextClick={() => setPage((prev) => prev + 1)}
                        prevDisabled={page === 0}
                        nextDisabled={dataSource.length < 10}
                        page={page}
                        pageCount={10}
                    />
                ) : null}
            </Table>
            {asset.value?.owner?.address && !isSameAddress(asset.value.owner.address, account) ? (
                <OfferTabActionBar />
            ) : null}
        </CollectibleTab>
    )
}