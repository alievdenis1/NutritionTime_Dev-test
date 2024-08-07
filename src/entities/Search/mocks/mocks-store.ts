import { ref } from 'vue'
import type { RecipesItem } from 'entities/Recipe/ui'

export const recipesData = ref<RecipesItem[]>([
    {
        id: 1,
        title: 'Recipe Title',
        image: '/image/recipes1.png',
        author: { name: 'Author Name', image: '/image/denis.svg' },
        rating: 4.5,
        cookingTime: 30,
        calories: 250,
        commentsCount: 10,
        time: '30 min',
        liked: true,
        likes: 100,
        likesCount: 200,
        savedToCollection: false
    },
    {
        id: 2,
        title: 'Recipe Title',
        image: '/image/recipes1.png',
        author: { name: 'Author Name', image: '/image/denis.svg' },
        rating: 4.5,
        cookingTime: 30,
        calories: 250,
        commentsCount: 10,
        time: '30 min',
        liked: true,
        likes: 100,
        likesCount: 200,
        savedToCollection: false
    },
    {
        id: 3,
        title: 'Recipe Title',
        image: '/image/recipes1.png',
        author: { name: 'Author Name', image: '/image/denis.svg' },
        rating: 4.5,
        cookingTime: 30,
        calories: 250,
        commentsCount: 10,
        time: '30 min',
        liked: true,
        likes: 100,
        likesCount: 200,
        savedToCollection: false
    },
])