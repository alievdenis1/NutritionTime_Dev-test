import { defineStore } from 'pinia'

import { Recipe, getRecipeList, RecipeListParams } from '@/entities/Recipe'

type State = {
	searchedRecipeList: Recipe[] | null,
    totalSearchedRecipes: number,
	filter: RecipeListParams,
};

export const useFilterStore = defineStore({
	id: 'filter-store',
	state: (): State => ({
		searchedRecipeList: null,
        totalSearchedRecipes: 0,
		filter: {},
	}),
	getters: {
        tagsSelectedCount(): number {
            return this.filter.tags?.length || 0
        }
	},
	actions: {
        setSearchedRecipeList(recipeList: Recipe[]) {
            this.searchedRecipeList = recipeList
        },
        resetSearchedRecipeList() {
            this.searchedRecipeList = null
            this.totalSearchedRecipes = 0
        },
        async fetchRecipeList() {
            // TODO: возможно тут смотреть на параметр связанный с пагинацией
            // Если запрашиваем не первую страницу, то расширяем массив
            // Если первую страницу, то заменяем текущий результат на полученный массив

            // TODO: возможно, если понадобится, как-то разнести пагинацию, фильтры, запросы, чтобы ответственность не смешивалась
            const { execute, data } = getRecipeList(this.filter || {})
            await execute()

            const result = data.value

            if (result?.data) {
                this.setSearchedRecipeList(result.data)

                this.totalSearchedRecipes = result.total
            }
        },
        // TODO: ещё учесть пагинацию!!!!!!!
        updateFilter(filter: RecipeListParams) {
            // TODO: возможно, что updateFilter будет сбрасывать настройки пагинации
            // Чтобы при изменении фильтра список рецептов отображался с самого начала
            this.filter = {
                ...this.filter,
                ...filter,
            }
        },
        updateFilterAndFetchRecipeList(filter: RecipeListParams) {
            this.updateFilter(filter)

            this.fetchRecipeList()
        },
        resetFilter() {
            this.filter = {}
        }
	}
})
