import type { User } from '@/entities/User/@x/Comment'

export type Image = {
    id: number;
    image_path: string;
}

export type Comment = {
    id: number;
    text: string;
    likes_count: number;
    is_liked: boolean;
    images?: Image[];
    rating: number;
    user: User;
}