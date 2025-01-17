export interface UserConfigModel {
  // general
  theme: 'light' | 'dark' | 'system'
  language_ui: 'zh' | 'en' | 'ja'
  language_item: 'auto' | 'zh' | 'en' | 'ja'
  // enhancements
  disable_patchcard_autofold: boolean
  disable_jobbtn_doubleclick: boolean
  // performance
  disable_workstate_cache: boolean
  // network
  disable_api_mirror: boolean

  // hidden options
  cache_ui_fold: any
  cache_work_state: any
}

// eslint-disable-next-line no-var
const defaultUserConfig: UserConfigModel = {
  theme: 'light',
  language_ui: 'zh',
  language_item: 'auto',
  disable_patchcard_autofold: false,
  disable_jobbtn_doubleclick: false,
  disable_workstate_cache: false,
  disable_api_mirror: false,

  cache_ui_fold: {}, // active cache, { key:string -> value:boolean }
  cache_work_state: {}, // active cache, view struct in `MainPage.vue` 's `workState`
}

/**
 * 修正用户配置，将其合并到默认配置中
 * 如果用户配置中有未定义的字段，则会使用默认配置中的值覆盖
 * 这样可以在添加配置项后保持对旧版本缓存的兼容性
 * @param config 传入缓存中的用户配置：`store.state.userConfig`
 * @returns 修正后的用户配置
 */
export const fixUserConfig = (config?: UserConfigModel) => {
  return assignDefaults(defaultUserConfig, config || {}) as UserConfigModel

  function assignDefaults(defaultConfig: any, currentConfig: any): any {
    for (const key in defaultConfig) {
      if (Object.prototype.hasOwnProperty.call(defaultConfig, key)) {
        if (typeof defaultConfig[key] === 'object' && !Array.isArray(defaultConfig[key]) && defaultConfig[key] !== null) {
          currentConfig[key] = assignDefaults(defaultConfig[key], currentConfig[key] || {});
        } else {
          currentConfig[key] = currentConfig[key] !== undefined ? currentConfig[key] : defaultConfig[key];
        }
      }
    }
    return currentConfig;
  }
}