'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useNewsDetail, incrementViewCount } from '@/hooks/api/useNews';
import { useRelatedNews } from '@/hooks/api/useNews';
import VideoPlayer from '@/components/news/VideoPlayer';
import NewsCard from '@/components/news/NewsCard';
import { Calendar, ChevronRight, Eye, Loader2, Tag, User } from 'lucide-react';

export default function NewsDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const { data: news, isLoading, error } = useNewsDetail(slug);
    const { data: relatedNews } = useRelatedNews(news?.id || 0, 3);

    // Increment view count when page loads
    useEffect(() => {
        if (news?.id) {
            incrementViewCount(news.id);
        }
    }, [news?.id]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy tin tức</h1>
                    <Link href="/news" className="text-primary hover:underline">
                        Quay lại danh sách tin tức
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                        <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
                            Trang chủ
                        </Link>
                        <ChevronRight size={16} className="text-gray-400" />
                        <Link href="/news" className="text-gray-500 hover:text-primary transition-colors">
                            Tin tức
                        </Link>
                        <ChevronRight size={16} className="text-gray-400" />
                        <Link
                            href={`/news/category/${news.category.slug}`}
                            className="text-gray-500 hover:text-primary transition-colors"
                        >
                            {news.category.categoryName}
                        </Link>
                        <ChevronRight size={16} className="text-gray-400" />
                        <span className="text-gray-900 font-medium line-clamp-1">{news.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className={`grid grid-cols-1 gap-8 ${relatedNews && relatedNews.length > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
                    {/* Article Content */}
                    <article className={relatedNews && relatedNews.length > 0 ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'}>
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            {/* Header */}
                            <div className="p-8 md:p-10 pb-6 bg-gradient-to-br from-white to-gray-50">
                                {/* Category Badge */}
                                <Link
                                    href={`/news/category/${news.category.slug}`}
                                    className="inline-flex items-center gap-1 bg-gradient-to-r from-primary to-green-600 text-white text-sm font-semibold px-5 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 mb-5"
                                >
                                    <span>📁</span>
                                    {news.category.categoryName}
                                </Link>

                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                                    {news.title}
                                </h1>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-6 pb-6 border-b-2 border-gray-200">
                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                                        <User size={16} className="text-primary" />
                                        <span className="font-medium">{news.author.fullName}</span>
                                    </div>
                                    {news.publishedAt && (
                                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                                            <Calendar size={16} className="text-primary" />
                                            <span>{formatDate(news.publishedAt)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                                        <Eye size={16} className="text-primary" />
                                        <span className="font-medium">{news.viewCount.toLocaleString()}</span>
                                        <span className="text-gray-500">lượt xem</span>
                                    </div>
                                </div>

                                {/* Excerpt */}
                                {news.excerpt && (
                                    <div className="bg-gradient-to-r from-primary/5 to-green-50 border-l-4 border-primary p-5 rounded-r-lg">
                                        <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium italic">
                                            {news.excerpt}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Media */}
                            <div className="px-8 mb-6">

                                {news.contentType === 'video' && news.videoFile ? (
                                    <VideoPlayer
                                        videoFile={news.videoFile}
                                        thumbnail={news.videoThumbnail}
                                        title={news.title}
                                    />
                                ) : news.featuredImage ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden">
                                        <Image
                                            src={news.featuredImage}
                                            alt={news.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : null}
                            </div>

                            {/* Content */}
                            <div className="px-8 pb-8">
                                <div
                                    className="prose prose-lg max-w-none
                                        prose-headings:font-bold prose-headings:text-gray-900
                                        prose-h1:text-3xl prose-h1:mb-4
                                        prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-8
                                        prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-6
                                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-gray-900 prose-strong:font-semibold
                                        prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                                        prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                                        prose-li:text-gray-700 prose-li:mb-2
                                        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                                        prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                                        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
                                        prose-img:rounded-lg prose-img:shadow-md"
                                    dangerouslySetInnerHTML={{ __html: news.content }}
                                />
                            </div>

                            {/* Tags */}
                            {news.newsTagRelations && news.newsTagRelations.length > 0 && (
                                <div className="px-8 md:px-10 pb-8 border-t-2 border-gray-100 pt-6 bg-gray-50">
                                    <div className="flex items-start gap-3 flex-wrap">
                                        <div className="flex items-center gap-2 text-gray-600 font-semibold">
                                            <Tag size={20} className="text-primary" />
                                            <span>Tags:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {news.newsTagRelations.map(({ tag }) => (
                                                <Link
                                                    key={tag.id}
                                                    href={`/news/tag/${tag.slug}`}
                                                    className="inline-flex items-center gap-1 bg-white hover:bg-primary hover:text-white border-2 border-gray-200 hover:border-primary text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105"
                                                >
                                                    <span className="text-xs">#</span>
                                                    {tag.tagName}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        {/* Related News */}
                        {relatedNews && relatedNews.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 sticky top-4 border border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-green-600 rounded-full"></div>
                                    <h3 className="text-xl font-bold text-gray-900">Tin liên quan</h3>
                                </div>
                                <div className="space-y-5">
                                    {relatedNews.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/news/${item.slug}`}
                                            className="block group"
                                        >
                                            <div className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                                                {/* Thumbnail */}
                                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                                    <Image
                                                        src={item.featuredImage || item.videoThumbnail || '/images/placeholder.jpg'}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-2 leading-snug">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {formatDate(item.publishedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
