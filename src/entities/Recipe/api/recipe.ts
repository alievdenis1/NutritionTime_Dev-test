import useApi from '@/shared/lib/api/use-api'
import { PaginationData } from '@/shared/lib/types/pagination-data'

import { Recipe } from '../model'

export type RecipeListParams = {
    search?: string;
    category_id?: number;
    tags?: number[];
    cuisine_id?: number;
    diet_type_id?: number;
}

export function getRecipeList(params: RecipeListParams) {
    return useApi<PaginationData<Recipe>>('get', '/recipes', params)
}

type RecipeParams = {
    id: string;
}

export function getRecipe(params: RecipeParams) {
    return useApi<Recipe>('get', `/recipes/${params.id}`)
}

export function getMyRecipeList() {
    return useApi<PaginationData<Recipe>>('get', '/recipes/my')
}

export function getFavoriteRecipeList() {
    return useApi<PaginationData<Recipe>>('get', '/recipes/favorites')
}
