import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Recipe } from '../types/recipe'
import { mockRecipe } from '../mocks/mock-recipes-item'

export const useRecipeStore = defineStore('recipeStore', () => {
    const route = useRoute()
    const recipes = ref<Recipe[]>(mockRecipe.value)

    const currentRecipe = computed(() => {
        const recipeId = route.params.id as string
        return recipes.value.find(recipe => recipe.id === recipeId)
    })

    return {
        recipes,
        currentRecipe
    }
})