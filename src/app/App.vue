<template>
	<VConfirm />

	<component :is="layout">
		<div
			v-if="isLoading"
			class="loading"
		>
			<div class="loading__spinner">
				<v-loading />
			</div>
		</div>
		<div v-else>
			<router-view />
		</div>
	</component>
</template>

<script setup lang="ts">
import { shallowRef, watch, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { DefaultLayout } from './layouts'
import { twa } from '@/shared/lib/api/twa'
import { useLocaleStore } from '@/shared/lib/i18n'
import { useAuthorization } from '@/features/Auth/log-in'
import { useSessionStore } from '@/entities/Session'

import { VConfirm } from '@/shared/components/Confirm'

const route = useRoute()

const layout = shallowRef<Component>(DefaultLayout)

const { isLoading, authorize } = useAuthorization()
const sessionStore = useSessionStore()
const localeStore = useLocaleStore()

const authUser = async () => {
  if (!sessionStore.isAuthenticated) {
    await authorize()
    localeStore.initializeLocale(sessionStore.lang)
  }
}

if (twa) {
  twa.ready()
  twa.enableClosingConfirmation()
  twa.disableVerticalSwipes()
  twa.expand()
  twa.onEvent('viewportChanged', ({ isStateStable }) => {
	if (isStateStable) {
		twa && twa.expand()
	}
  })
}

// WebApp.enableClosingConfirmation()
// WebApp.disableVerticalSwipes()
// WebApp.expand()
// WebApp.BackButton.show()
// WebApp.HapticFeedback.impactOccurred('heavy')

// onMounted(() => {

// })

authUser()

watch(() => route?.path, () => {
	authUser()
})

watch(() => route?.meta?.layout, (newLayoutComponent) => {
	layout.value = newLayoutComponent || DefaultLayout
})
</script>

<style lang="scss" src="shared/styles/index.scss" />
