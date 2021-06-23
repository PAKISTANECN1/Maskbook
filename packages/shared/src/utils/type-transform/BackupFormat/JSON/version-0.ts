/* eslint-disable import/no-deprecated */

import type { AESJsonWebKey, EC_Private_JsonWebKey, EC_Public_JsonWebKey } from '../../../..'

/**
 * @deprecated History JSON backup file
 */
export interface BackupJSONFileVersion0 {
    key: {
        username: string
        key: { publicKey: EC_Public_JsonWebKey; privateKey?: EC_Private_JsonWebKey }
        algor: unknown
        usages: string[]
    }
    local: AESJsonWebKey
}
// eslint-disable-next-line import/no-deprecated
export function isBackupJSONFileVersion0(obj: object): obj is BackupJSONFileVersion0 {
    // eslint-disable-next-line import/no-deprecated
    const data: BackupJSONFileVersion0 = obj as any
    if (!data.local || !data.key || !data.key.key || !data.key.key.privateKey || !data.key.key.publicKey) return false
    return true
}
