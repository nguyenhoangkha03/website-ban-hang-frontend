import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Category {
    id: number;
    categoryKey: string;
    categoryName: string;
    description?: string;
    slug: string;
    displayOrder: number;
    status: string;
    _count?: {
        news: number;
    };
}

interface Tag {
    id: number;
    tagName: string;
    slug: string;
    _count?: {
        newsTagRelations: number;
    };
}

/**
 * Fetch all news categories
 */
export function useNewsCategories() {
    return useQuery({
        queryKey: ['news-categories'],
        queryFn: async () => {
            const { data } = await axios.get<{ success: boolean; data: Category[] }>(
                `${API_URL}/news-categories`
            );
            return data.data;
        },
    });
}

/**
 * Fetch category by slug
 */
export function useNewsCategoryBySlug(slug: string) {
    return useQuery({
        queryKey: ['news-category', slug],
        queryFn: async () => {
            const { data } = await axios.get<{ success: boolean; data: Category }>(
                `${API_URL}/news-categories/${slug}`
            );
            return data.data;
        },
        enabled: !!slug,
    });
}

/**
 * Fetch all news tags
 */
export function useNewsTags() {
    return useQuery({
        queryKey: ['news-tags'],
        queryFn: async () => {
            const { data } = await axios.get<{ success: boolean; data: Tag[] }>(
                `${API_URL}/news-tags`
            );
            return data.data;
        },
    });
}

/**
 * Fetch tag by slug
 */
export function useNewsTagBySlug(slug: string) {
    return useQuery({
        queryKey: ['news-tag', slug],
        queryFn: async () => {
            const { data } = await axios.get<{ success: boolean; data: Tag }>(
                `${API_URL}/news-tags/${slug}`
            );
            return data.data;
        },
        enabled: !!slug,
    });
}
