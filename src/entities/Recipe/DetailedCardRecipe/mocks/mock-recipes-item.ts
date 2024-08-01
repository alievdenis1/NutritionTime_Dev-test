import { ref } from 'vue'

export interface Comment {
    author: string;
    text: string;
    likes: number;
    image: string | null;
    authorImage?: string | null;
}

export const mockRecipe = ref({
    id: '1',
    title: 'Вкуснейший домашний бургер',
    description: 'Это рецепт вкуснейшего домашнего бургера, который очень просто приготовить',
    image: '/image/recipes1.png',
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
            image: '/image/recipes2.png'
        },
        {
            description: 'В мясной фарш добавляем соль и перец по вкусу, хорошо вымешиваем. Формируем шарик, расплющиваем его в руках, чтобы получилась плоская котлета. Надавливаем большим пальцем в центр котлеты, чтобы она не вздулась во время обжаривания.',
            image: '/image/recipes2.png'
        },
        {
            description: 'Обжариваем котлету 4-5 минут с каждой стороны.На готовую котлету кладем тонкий кусочек сыра.',
            image: '/image/recipes2.png'
        },
        {
            description: 'Помидоры нарезаем кружочками, твердый сыр - тонкими пластинами, соленый огурец - тонкими кружочками.В отдельной емкости смешиваем майонез и кетчуп.',
            image: '/image/recipes2.png'
        },
        {
            description: 'На котлету выкладываем пару ломтиков соленого огурца и ломтик сыра.',
            image: '/image/recipes2.png'
        },
        {
            description: 'Накрываем бургер второй частью булочки. По такому же принципу формируем остальные бургеры. Приятного аппетита!',
            image: '/image/recipes2.png'
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
            authorImage: '/image/denis.svg',
            author: 'Игнат Балышев',
            text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
            likes: 0,
            image: '/image/recipes2.png',
        },
        {
            authorImage: '/image/denis.svg',
            author: 'Игнат Балышев',
            text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
            likes: 12,
            image: null,
        },
        {
            authorImage: '/image/denis.svg',
            author: 'Игнат Балышев',
            text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
            likes: 24,
            image: '/image/recipes2.png',
        }
    ],
    nftOwner: {
        name: 'Денис Алиев',
        image: '/image/denis.svg'
    }
})