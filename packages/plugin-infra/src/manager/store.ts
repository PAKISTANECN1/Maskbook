import type { Plugin } from '../types'

const __registered = new Map<string, Plugin.DeferredDefinition>()

export const registeredPlugins: Iterable<Plugin.DeferredDefinition> = { [Symbol.iterator]: () => __registered.values() }
export const registeredPluginIDs: Iterable<string> = { [Symbol.iterator]: () => __registered.keys() }
export function getPluginDefine(id: string) {
    return __registered.get(id)
}
export function registerPlugin(def: Plugin.DeferredDefinition) {
    if (__registered.has(def.ID)) return
    if (!__meetRegisterRequirement(def)) return
    __registered.set(def.ID, def)
}

function __meetRegisterRequirement(def: Plugin.Shared.Definition) {
    try {
        // arch check
        // TODO: process.env.architecture is not well known envs
        if (process.env.architecture === 'app' && !def.enableRequirement.architecture.app) return false
        if (process.env.architecture === 'web' && !def.enableRequirement.architecture.web) return false
    } catch {}

    // build variant check
    if (process.env.NODE_ENV === 'production') {
        // arch check
        // TODO: process.env.build is not well known envs
        try {
            if (process.env.build === 'stable' && def.enableRequirement.target !== 'stable') {
                return false
            } else if (process.env.build === 'beta' && def.enableRequirement.target === 'insider') {
                return false
            }
        } catch {}
    }
    return true
}
