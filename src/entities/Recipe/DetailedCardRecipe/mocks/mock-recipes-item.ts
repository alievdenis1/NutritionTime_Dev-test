import { ref } from 'vue'
import { Recipe } from '../types/recipe'

export const addPrefix = (url: string) => {
    const prefix = '/NutritionTime_Dev-test'
    return `${prefix}${url}`
}

export const mockRecipe = ref<Recipe[]>([
    {
        id: '1',
        title: 'Вкуснейший домашний бургер',
        description: 'Это рецепт вкуснейшего домашнего бургера, который очень просто приготовить',
        image: addPrefix('/image/recipes1.png'),
        author: {
            name: 'Денис Алиев',
            image: '/image/denis.svg'
        },
        rating: 5.0,
        reviewsCount: 12,
        ingredients: [
            { name: 'Булочка для бургера', amount: '1 шт.' },
            { name: 'Говядина', amount: '300 г.' },
            { name: 'Лук', amount: '300 г.' },
            { name: 'Сыр Чедер', amount: '300 г.' },
            { name: 'Маринованные огурцы', amount: '300 г.' },
            { name: 'Подсолнечное масло', amount: '300 г.' },
            { name: 'Соус для бургера', amount: '300 г.' },
        ],
        totalWeight: 800,
        cookingSteps: [
            {
                description: 'Подготавливаем необходимые ингредиенты для бургера',
                image: addPrefix('/image/recipes3.png')
            },
            {
                description: 'В мясной фарш добавляем соль и перец по вкусу, хорошо вымешиваем. Формируем шарик, расплющиваем его в руках, чтобы получилась плоская котлета. Надавливаем большим пальцем в центр котлеты, чтобы она не вздулась во время обжаривания.',
                image: addPrefix('/image/recipes2.png')
            },
            {
                description: 'Обжариваем котлету 4-5 минут с каждой стороны.На готовую котлету кладем тонкий кусочек сыра.',
                image: addPrefix('/image/recipes2.png')
            },
            {
                description: 'Помидоры нарезаем кружочками, твердый сыр - тонкими пластинами, соленый огурец - тонкими кружочками.В отдельной емкости смешиваем майонез и кетчуп.',
                image: addPrefix('/image/recipes1.png')
            },
            {
                description: 'На котлету выкладываем пару ломтиков соленого огурца и ломтик сыра.',
                image: addPrefix('/image/recipes2.png')
            },
            {
                description: 'Накрываем бургер второй частью булочки. По такому же принципу формируем остальные бургеры. Приятного аппетита!',
                image: addPrefix('/image/recipes3.png')
            },
        ],
        recipeInfo: {
            'Категория': 'Завтрак',
            'Кухня': 'Итальянская',
            'Тип диеты': 'Безглютеновый',
            'Время на кухне': '30 минут',
            'Будет готово через': '60 минут',
            'Уровень остроты': '5 из 5',
            'Уровень сложности': '3 из 5'
        },
        nutritionInfo: {
            'Калорийность на 100 г.': '350 ккал',
            'Белки на 100 г.': '24 г.',
            'Жиры на 100 г.': '34 г.',
            'Углеводы на 100 г.': '54 г.'
        },
        kitchenware: ['Сковородка'],
        tags: ['тег1', 'тег2', 'тег3'],
        comments: [
            {
                authorImage: addPrefix('/image/denis.svg'),
                author: 'Игнат Балышев',
                text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
                likes: 0,
                image: addPrefix('/image/recipes2.png'),
            },
            {
                authorImage: addPrefix('/image/denis.svg'),
                author: 'Игнат Балышев',
                text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
                likes: 12,
                image: null,
            },
            {
                authorImage: addPrefix('/image/denis.svg'),
                author: 'Игнат Балышев',
                text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
                likes: 24,
                image: addPrefix('/image/recipes2.png'),
            }
        ],
        nftOwner: {
            name: 'Денис Алиев',
            image: addPrefix('/image/denis.svg')
        }
    },
    {
        id: '2',
        title: 'Ещё один вкусный рецепт',
        description: 'Описание второго вкусного рецепта',
        image: addPrefix('/image/recipes3.png'),
        author: {
            name: 'Иван Иванов',
            image: addPrefix('/image/CatIllustration.png')
        },
        rating: 4.5,
        reviewsCount: 8,
        ingredients: [
            { name: 'Ингредиент 1', amount: '100 г.' },
            { name: 'Ингредиент 2', amount: '200 г.' },
            { name: 'Ингредиент 3', amount: '150 г.' },
        ],
        totalWeight: 500,
        cookingSteps: [
            {
                description: 'Шаг первый',
                image: addPrefix('/image/recipes1.png')
            },
            {
                description: 'Шаг второй',
                image: addPrefix('/image/recipes1.png')
            },
            {
                description: 'Шаг третий',
                image: addPrefix('/image/recipes1.png')
            },
        ],
        recipeInfo: {
            'Категория': 'Обед',
            'Кухня': 'Французская',
            'Тип диеты': 'Веганский',
            'Время на кухне': '45 минут',
            'Будет готово через': '90 минут',
            'Уровень остроты': '3 из 5',
            'Уровень сложности': '2 из 5'
        },
        nutritionInfo: {
            'Калорийность на 100 г.': '300 ккал',
            'Белки на 100 г.': '20 г.',
            'Жиры на 100 г.': '25 г.',
            'Углеводы на 100 г.': '40 г.'
        },
        kitchenware: ['Кастрюля', 'Сковородка'],
        tags: ['тег4', 'тег5', 'тег6'],
        comments: [
            {
                authorImage: addPrefix('/image/CatIllustration.png'),
                author: 'Петр Петров',
                text: 'Отличный рецепт, очень понравилось!',
                likes: 5,
                image: addPrefix('/image/recipes3.png'),
            },
            {
                authorImage: addPrefix('/image/CatIllustration.png'),
                author: 'Анна Смирнова',
                text: 'Очень вкусно, спасибо!',
                likes: 10,
                image: null,
            }
        ],
        nftOwner: {
            name: 'Иван Иванов',
            image: addPrefix('/image/CatIllustration.png')
        }
    }
])