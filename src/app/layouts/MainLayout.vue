<template>
	<main :class="`layout p-[16px] pb-[50px] bg-mainBg`">
		<slot />
	</main>
	<footer-widget />
</template>

<script setup lang="ts">
import { FooterWidget } from 'widgets/footer'
</script>