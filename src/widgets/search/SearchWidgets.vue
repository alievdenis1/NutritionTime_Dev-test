<template>
	<div>
		<div ref="searchBarRef" />
		<div
			:class="[
				' duration-300 z-10 bg-white w-full',
				{ 'fixed top-0 left-0 right-0 px-[16px]': isSearchBarFixed }
			]"
		>
			<SearchBar />
			<QuickSearchTag v-if="showQuickSearchTag" />
		</div>
		<div
			v-if="isSearchBarFixed"
			class="h-[44px]"
		/>
		<div
			class="scrollable"
			@scroll="handleScroll"
		>
			<QuickSearchTag v-if="!showQuickSearchTag" />
			<RecipePreviewSearch
				v-if="!store.isLoading"
				:recipes="store.recipes"
			/>
			<div v-else>
				<VSkeletonCard
					v-for="recipe in 3"
					:key="recipe"
					class="recipe-card"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { SearchBar, QuickSearchTag, RecipePreviewSearch, useSearchStore } from 'entities/Recipe/Search'
import { VSkeletonCard } from 'shared/components/ui/skeleton'

const store = useSearchStore()

const searchBarRef = ref<HTMLElement | null>(null)
const isSearchBarFixed = ref(false)
const searchBarHeight = ref(0)
const scrollTop = ref(0)
const lastScrollTop = ref(0)

const showQuickSearchTag = ref(false)

const handleScroll = (event: Event) => {
    const scrollPosition = (event.target as HTMLElement).scrollTop
    console.log('Позиция прокрутки блока:', scrollPosition)

    lastScrollTop.value = scrollTop.value
    scrollTop.value = scrollPosition

    if (scrollPosition > 80) {
        showQuickSearchTag.value = scrollTop.value < lastScrollTop.value
    } else {
        showQuickSearchTag.value = true
    }
}

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
        isSearchBarFixed.value = !entry.isIntersecting
        console.log('Is search bar fixed:', isSearchBarFixed.value)
    })
}

let observer: IntersectionObserver | null = null

onMounted(async () => {
    await nextTick()
    const mainElement = document.getElementById('main')
    if (mainElement) {
        mainElement.addEventListener('scroll', handleScroll)
        console.log('Обработчик события прокрутки добавлен для блока #main')
    }

    if (searchBarRef.value) {
        searchBarHeight.value = searchBarRef.value.offsetHeight
        console.log('Search bar height:', searchBarHeight.value)

        observer = new IntersectionObserver(handleIntersection, {
            threshold: 0,
            rootMargin: `-${searchBarHeight.value}px 0px 0px 0px`
        })

        observer.observe(searchBarRef.value)
    } else {
        console.warn('searchBarRef is null')
    }
})

onUnmounted(() => {
    if (observer && searchBarRef.value) {
        observer.unobserve(searchBarRef.value)
    }
})
</script>

<style scoped>
.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}
</style>@/entities/Recipe/Search