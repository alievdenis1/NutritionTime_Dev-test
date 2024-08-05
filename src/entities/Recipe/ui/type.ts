interface Author {
	name: string;
	profile_image: string;
}

export interface RecipesItem {
	id: number;
	image: string;
	title: string;
	rating: string;
	time: string;
	calories: string;
	author: Author;
	comments: number;
	bookmarked: boolean;
	liked: boolean;
	likes: number;
}

export type RecipesList = RecipesItem[]
