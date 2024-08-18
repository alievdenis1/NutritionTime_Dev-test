<template>
	<div>
		<CheckRecipe />

		<footer-widget	class="fixed bottom-0 left-0" />
	</div>
</template>

<script setup lang="ts">
import { FooterWidget } from 'widgets/footer'
import { CheckRecipe } from 'entities/Recipe/CreateRecipe/recipe-models'
</script>

<style scoped></style>