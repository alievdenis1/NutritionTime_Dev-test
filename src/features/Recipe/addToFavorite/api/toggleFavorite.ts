import useApi from '@/shared/lib/api/use-api'

type ToggleFavoriteParams = {
    recipeId: number;
}

export function toggleFavorite(params: ToggleFavoriteParams) {
    return useApi('post', `/recipes/${params.recipeId}/favorite`)
}
