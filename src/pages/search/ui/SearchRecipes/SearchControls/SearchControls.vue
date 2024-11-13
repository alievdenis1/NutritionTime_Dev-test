<template>
	<div ref="searchBarRef" />
	<div
		:class="[
			'duration-300 z-10 w-full pt-[20px] bg-transparent',
			{ 'fixed top-0 left-0 right-0 px-[16px]': isSearchBarFixed }
		]"
	>
		<div class="flex gap-[12px] items-center w-full mb-[12px]">
			<SearchField />
			<FilterButton />
		</div>
		<div
			v-if="showQuickSearchTag"
			class="flex flex-row gap-[12px]"
		>
			<TagsButton />
			<div class="w-[2px] h-[40px] bg-lightGray" />
			<CategoriesFilter />
		</div>
	</div>
	<div
		v-if="isSearchBarFixed"
		class="h-[44px]"
	/>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
// TODO: потом удалить эти компоненты и всё, что с ними связано
// import { SearchBar, QuickSearchTag } from '@/entities/Recipe/Search'
import { SearchField } from './SearchField'
import { FilterButton } from './FilterButton'
import { CategoriesFilter } from './CategoriesFilter'
import { TagsButton } from './TagsButton'

const searchBarRef = ref<HTMLElement | null>(null)
const isSearchBarFixed = ref(false)
const searchBarHeight = ref(0)
const scrollTop = ref(0)
const lastScrollTop = ref(0)

const showQuickSearchTag = ref(true)

const handleScroll = (event: Event) => {
    const scrollPosition = (event.target as HTMLElement).scrollTop

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
    })
}

let observer: IntersectionObserver | null = null

onMounted(async () => {
    await nextTick()
    const mainElement = document.getElementById('main')
    if (mainElement) {
        mainElement.addEventListener('scroll', handleScroll)
    }

    if (searchBarRef.value) {
        searchBarHeight.value = searchBarRef.value.offsetHeight
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
</style>