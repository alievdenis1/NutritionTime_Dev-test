import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Recipe } from '../types/recipe'
import { mockRecipe } from '../mocks/mock-recipes-item'

const formatIngredientWeight = (ingredient: { name: string; amount: string; type: string }) => {
    const weight = ingredient.amount

    if (ingredient.type === 'quantity') {
        return 0
    }

    return Number(weight.replace(/[^+\d]/g, ''))
}

const calculateTotalWeight = (ingredients: { name: string; amount: string; type: string }[])=> {
    let totalWeight = 0
    const percents = 10

    ingredients?.forEach(ingredient => {
        const ingredientAmount = formatIngredientWeight(ingredient)

        totalWeight += ingredientAmount
    })

    return totalWeight - totalWeight * percents / 100
}

const calculateRecipeRating = (comments:{
    author: string;
    text: string;
    likes: number;
    image: string | null;
    rating: number,
    authorImage?: string | null;
}[]) => {
    return comments.reduce((sum, comment) => sum += comment.rating,0) / comments.length
}

export const useRecipeStore = defineStore('recipeStore', () => {
    const route = useRoute()
    const recipes = ref<Recipe[]>(mockRecipe.value)

    const currentRecipe = computed(() => {
        const recipeId = route.params.id as string
        const currentRecipeInfo = recipes.value.find(recipe => recipe.id === recipeId)

        if(currentRecipeInfo) {
            currentRecipeInfo.totalWeight = calculateTotalWeight(currentRecipeInfo?.ingredients)
            currentRecipeInfo.reviewsCount = currentRecipeInfo.comments.length || 0
            currentRecipeInfo.rating = calculateRecipeRating(currentRecipeInfo?.comments)
        }

        return currentRecipeInfo

    })

    const toggleRecipeFavourited = (isFavourited: boolean) => {
        if(currentRecipe.value) {
            currentRecipe.value.favourited = isFavourited
        }
    }

    const setRecipeRating = (rate: number) => {
        if(currentRecipe.value) {
            currentRecipe.value.rating = (Number(currentRecipe.value?.rating) + rate) / 2
        }
    }

    const setRecipeInfoField = (field: string, value: string) => {
        if (currentRecipe.value) {
            currentRecipe.value.recipeInfo[field] = value + currentRecipe.value.recipeInfo[field].slice(1)
        }
    }

    return {
        recipes,
        currentRecipe,
        setRecipeInfoField,
        setRecipeRating,
        toggleRecipeFavourited,
    }
})