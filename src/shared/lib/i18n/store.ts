import { defineStore } from 'pinia'
import type { Locales } from './types'
import i18n from './i18n.config'
import { computed, ref , Ref, ComputedRef } from 'vue'

type State = {
	currentLocale: Ref<Locales>,
    selectedLocale: ComputedRef<Locales>,
    setLocale: (newLocale: Locales) => void,
    initializeLocale: () => void
}

export const useLocaleStore = defineStore('locale', (): State => {
    const currentLocale = ref<Locales>('ru')

    const selectedLocale = computed((): Locales => currentLocale.value || 'ru')

    const setLocale = (newLocale: Locales): void => {
        currentLocale.value = newLocale
        i18n.global.locale.value = newLocale
    }

    const initializeLocale = (): void => {
        currentLocale.value = selectedLocale.value
        i18n.global.locale.value = selectedLocale.value
    }

    return {
        currentLocale,
        selectedLocale,
        setLocale,
        initializeLocale
    }
}, {
    persist: {
        storage: localStorage,
        paths: ['currentLocale']
    }
})
