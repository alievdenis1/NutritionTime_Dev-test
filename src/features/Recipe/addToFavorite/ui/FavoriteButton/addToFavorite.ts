import { ref } from 'vue'
import { toggleFavorite } from '../../api'

export const useAddToFavorite = ({
    isFavoriteInit,
    likes,
    recipeId,
}: {
    isFavoriteInit: boolean;
    likes: number;
    recipeId: number;
}) => {
    const isFavorite = ref(isFavoriteInit || false)
    const likesAmount = ref(likes || 0)

    const { data, execute } = toggleFavorite({ recipeId: recipeId })

    const handleClick = async () => {
        const like = isFavorite.value ? -1 : 1
        likesAmount.value = likesAmount.value + like
        isFavorite.value = !isFavorite.value

        await execute()

        // isFavorite.value = data.value.is_Liked
        // likesAmount.value = data.value.likes_count
    }

    return {
        isFavorite,
        likesAmount,
        handleClick,
    }
}
