import useApi from '@/shared/lib/api/use-api'
import { PaginationData } from '@/shared/lib/types/pagination-data'
import { Comment } from '../model'

export type CommentList = Comment[]

type GetCommentListParams = {
    recipeId: string;
}

export function getCommentList({ recipeId }: GetCommentListParams) {
    return useApi<PaginationData<CommentList>>('get', `/api/recipes/${recipeId}/comments`)
}
