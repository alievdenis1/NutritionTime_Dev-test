import useApi from '@/shared/lib/api/use-api'

type ToggleCommentParams = {
    recipeId: number;
    commentId: number;
}

export function toggleComment(params: ToggleCommentParams) {
    return useApi('post', `/api/recipes/${params.recipeId}/comments/${params.commentId}/like`)
}
