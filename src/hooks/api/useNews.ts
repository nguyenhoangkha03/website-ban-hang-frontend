import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface NewsQuery {
    page?: number;
    limit?: number;
    categoryId?: number;
    contentType?: 'article' | 'video';
    status?: 'draft' | 'published' | 'archived';
    isFeatured?: boolean;
    search?: string;
    sortBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'title';
    sortOrder?: 'asc' | 'desc';
}

interface News {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    contentType: 'article' | 'video';
    featuredImage?: string;
    videoUrl?: string;
    videoThumbnail?: string;
    videoDuration?: number;
    categoryId: number;
    authorId: number;
    status: 'draft' | 'published' | 'archived';
    publishedAt?: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    isFeatured: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    createdAt: string;
    updatedAt: string;
    category: {
        id: number;
        categoryName: string;
        slug: string;
    };
    author: {
        id: number;
        fullName: string;
        avatarUrl?: string;
    };
    newsTagRelations: Array<{
        tag: {
            id: number;
            tagName: string;
            slug: string;
        };
    }>;
}

interface NewsResponse {
    success: boolean;
    data: News[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Fetch news list with pagination and filters
 */
export function useNews(query: NewsQuery = {}) {
    return useQuery({
        queryKey: ['news', query],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (query.page) params.append('page', query.page.toString());
            if (query.limit) params.append('limit', query.limit.toString());
            if (query.categoryId) params.append('categoryId', query.categoryId.toString());
            if (query.contentType) params.append('contentType', query.contentType);
            if (query.isFeatured !== undefined) params.append('isFeatured', query.isFeatured.toString());
            if (query.search) params.append('search', query.search);
            if (query.sortBy) params.append('sortBy', query.sortBy);
            if (query.sortOrder) params.append('sortOrder', query.sortOrder);

            const { data } = await axios.get<NewsResponse>(`${API_URL}/news?${params.toString()}`);
            return data;
        },
    });
}

/**
 * Fetch news detail by slug
 */
export function useNewsDetail(slug: string) {
    return useQuery({
        queryKey: ['news', slug],
        queryFn: async () => {
            const { data } = await axios.get<{ success: boolean; data: News }>(`${API_URL}/news/${slug}`);
            return data.data;
        },
        enabled: !!slug,
    });
}

/**
 * Fetch featured news
 */
export function useFeaturedNews(limit: number = 5) {
    return useQuery({
        queryKey: ['news', 'featured', limit],
        queryFn: async () => {
            const { data } = await axios.get<{ success: boolean; data: News[] }>(
                `${API_URL}/news/featured?limit=${limit}`
            );
            return data.data;
        },
    });
}

/**
 * Fetch related news
 */
export function useRelatedNews(newsId: number, limit: number = 5) {
    return useQuery({
        queryKey: ['news', newsId, 'related', limit],
        queryFn: async () => {
            const { data } = await axios.get<{ success: boolean; data: News[] }>(
                `${API_URL}/news/${newsId}/related?limit=${limit}`
            );
            return data.data;
        },
        enabled: !!newsId,
    });
}

/**
 * Increment view count
 */
export async function incrementViewCount(newsId: number) {
    await axios.post(`${API_URL}/news/${newsId}/view`);
}
