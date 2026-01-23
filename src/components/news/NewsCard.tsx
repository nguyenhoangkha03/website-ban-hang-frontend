import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Calendar, Eye, Play, User } from 'lucide-react';

interface NewsCardProps {
    news: {
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
    };
}

export default function NewsCard({ news }: NewsCardProps) {
    const router = useRouter();

    const thumbnail = news.contentType === 'video' && news.videoThumbnail
        ? news.videoThumbnail
        : news.featuredImage || '/images/placeholder.jpg';

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCategoryClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/news/category/${news.category.slug}`);
    };

    return (
        <Link href={`/news/${news.slug}`}>
            <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                    <Image
                        src={thumbnail}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Video Badge */}
                    {news.contentType === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                            <div className="bg-primary rounded-full p-4 group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                        </div>
                    )}

                    {/* Duration Badge */}
                    {news.contentType === 'video' && news.videoDuration && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {formatDuration(news.videoDuration)}
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                        <button
                            onClick={handleCategoryClick}
                            className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-green-700 transition-colors cursor-pointer"
                        >
                            {news.category.categoryName}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {news.title}
                    </h3>

                    {/* Excerpt */}
                    {news.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {news.excerpt}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                            {/* Author */}
                            <div className="flex items-center gap-1">
                                <User size={14} />
                                <span>{news.author.fullName}</span>
                            </div>

                            {/* Date */}
                            {news.publishedAt && (
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{formatDate(news.publishedAt)}</span>
                                </div>
                            )}
                        </div>

                        {/* Views */}
                        <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{news.viewCount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
