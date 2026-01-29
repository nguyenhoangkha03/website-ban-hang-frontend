import NewsCard from './NewsCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface News {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    contentType: 'article' | 'video';
    featuredImage?: string;
    videoThumbnail?: string;
    videoDuration?: number;
    publishedAt?: string;
    viewCount: number;
    category: {
        categoryName: string;
        slug: string;
    };
    author: {
        fullName: string;
        avatarUrl?: string;
    };
}

interface NewsListProps {
    news: News[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange?: (page: number) => void;
}

export default function NewsList({ news, pagination, onPageChange }: NewsListProps) {
    if (!news || news.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Không có tin tức nào</p>
            </div>
        );
    }

    return (
        <div>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {news.map((item) => (
                    <NewsCard key={item.id} news={item} />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => onPageChange?.(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-2">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current
                            const showPage =
                                page === 1 ||
                                page === pagination.totalPages ||
                                (page >= pagination.page - 1 && page <= pagination.page + 1);

                            if (!showPage) {
                                // Show ellipsis
                                if (page === pagination.page - 2 || page === pagination.page + 2) {
                                    return <span key={page} className="px-3 py-2">...</span>;
                                }
                                return null;
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange?.(page)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === pagination.page
                                            ? 'bg-primary text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => onPageChange?.(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Pagination Info */}
            {pagination && (
                <div className="text-center mt-4 text-sm text-gray-500">
                    Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} tin tức
                </div>
            )}
        </div>
    );
}
