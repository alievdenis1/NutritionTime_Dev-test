import { defineStore } from 'pinia'

import { getCategoryList, CategoryList } from '@/entities/Category'
import { getTagList, TagList } from '@/entities/Tag'
import { getCuisineList, CuisineList } from '@/entities/Cuisine'
import { getDietTypeList, DietList } from '@/entities/DietType'
import { getIngredientList, IngredientList } from '@/entities/Ingredient'

type State = {
	categoryList: CategoryList | null,
    tagList: TagList | null,
    cuisineList: CuisineList | null,
    dietTypeList: DietList | null,
    ingredientList: IngredientList | null,
};

export type TagsByCategory = Record<string, TagList>

export const useFilterCatalogsStore = defineStore({
	id: 'filter-catalogs-store',
	state: (): State => ({
		categoryList: null,
        tagList: null,
        cuisineList: null,
        dietTypeList: null,
        ingredientList: null,
	}),
	getters: {
        tagsByCategories(): TagsByCategory {
            return (this.tagList || []).reduce((acc, tag) => {
                const { category } = tag

                if (!acc[category]) {
                    acc[category] = []
                }

                acc[category].push(tag)

                return acc
            }, {} as TagsByCategory)
        }
	},
	actions: {
        updateStore<T extends keyof State>(key: T, value: State[T]) {
            this.$state[key] = value
        },
        // TODO: ещё учесть пагинацию!!!!!!!
        async fetchCategoryList() {
            const { execute, data } = getCategoryList()
            await execute()

            if (data.value) {
                this.updateStore('categoryList', data.value)
            }
        },
        async fetchTagList() {
            const { execute, data } = getTagList()
            await execute()

            if (data.value?.data) {
                this.updateStore('tagList', data.value.data)
            }
        },
        // TODO: возможно сделать одну функцию на получение списков
        // fetchCatalogList(type: keyof State) {}
        // Но нужно, чтобы у всех был одинаковый интерфейс через пагинацию
        async fetchCuisineList() {
            const { execute, data } = getCuisineList()
            await execute()

            if (data.value) {
                this.updateStore('cuisineList', data.value)
            }
        },
        async fetchDietTypeList() {
            const { execute, data } = getDietTypeList()
            await execute()

            if (data.value) {
                this.updateStore('dietTypeList', data.value)
            }
        },
        async fetchIngredientList() {
            const { execute, data } = getIngredientList({})
            await execute()

            if (data.value?.data) {
                this.updateStore('ingredientList', data.value.data)
            }
        },
	}
})
