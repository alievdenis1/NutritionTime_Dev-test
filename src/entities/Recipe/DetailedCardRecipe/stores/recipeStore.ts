import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Recipe } from '../types/recipe'
import { mockRecipe } from '../mocks/mock-recipes-item'

const calculateTotalWeight = (ingredients: { name: string; amount: string; }[])=> {
    const percents = 10
    const ingredientsWeights = ingredients?.map(ingredient => {
        if (ingredient.amount.includes('шт')) {
            return 0
        }

        const ingredientAmount = Number(ingredient.amount.replace(/[^+\d]/g, ''))
        return ingredientAmount
    })

    return ingredientsWeights?.reduce((acc, weight) => acc += weight - weight * percents / 100, 0)
}

export const useRecipeStore = defineStore('recipeStore', () => {
    const route = useRoute()
    const recipes = ref<Recipe[]>(mockRecipe.value)

    const currentRecipe = computed(() => {
        const recipeId = route.params.id as string
        const currentRecipeInfo = recipes.value.find(recipe => {
            if (recipe.id === recipeId) {
                recipe.totalWeight = calculateTotalWeight(recipe?.ingredients)

                return recipe
            }
        })

        return currentRecipeInfo
    })

    const setRecipeInfoField = (field: string, value: string) => {
        if (currentRecipe.value) {
            currentRecipe.value.recipeInfo[field] = value + currentRecipe.value.recipeInfo[field].slice(1)
        }
    }

    return {
        recipes,
        currentRecipe,
        setRecipeInfoField,
    }
})