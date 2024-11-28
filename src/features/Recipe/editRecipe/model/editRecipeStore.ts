import  { defineStore } from 'pinia'

import { Recipe } from '@/entities/Recipe'

type EditRecipe = Partial<Recipe>

type State = {
	recipe: EditRecipe,
};

const INITIAL_RECIPE: EditRecipe = {
    spiciness: 3,
    difficulty: 3,
}

// TODO: тут добавить валидацию, объект с правилами валидации
// Если что создать рядом отдельную стору для валидации
// Или реализовать валидацию отдельно в общем компоненте в стейт и передавать через пропс

// TODO: всё таки тут реализовать весь функционал валидации формы создания/редактирования
// TODO: какой-то общий функционал валидации можно вынести в entity или shared

export const editRecipeStore = defineStore({
    id: 'edit-recipe-store',
    state: (): State => ({
        recipe: INITIAL_RECIPE,
    }),
    getters: {},
    actions: {
        // setRecipe() {},
        updateRecipe(recipe: EditRecipe) {
            this.recipe = {
                ...this.recipe,
                ...recipe,
            }
        },
        // createRecipe() {},
    },
})