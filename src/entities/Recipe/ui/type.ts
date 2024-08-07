interface Author {
	name: string;
	image: string;
}

export interface RecipesItem {
	id: number;
	image: string;
	title: string;
	rating: number;
	time: string;
	calories: number;
	author: Author;
	commentsCount: number;
	cookingTime: number;
	liked: boolean;
	likes: number;
	likesCount?: number;
	savedToCollection: boolean; // Новое поле для иконки сохранения в коллекцию
}

export type RecipesList = RecipesItem[]
