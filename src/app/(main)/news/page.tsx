'use client';

import { useState } from 'react';
import { useNews } from '@/hooks/api/useNews';
import { useNewsCategories } from '@/hooks/api/useNewsCategories';
import NewsList from '@/components/news/NewsList';
import { ChevronRight, Loader2, Search } from 'lucide-react';
import Link from 'next/link';

export default function NewsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>();

    const { data, isLoading, error } = useNews({
        page,
        limit: 9,
        search: search || undefined,
        categoryId: selectedCategory,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
    });

    const { data: categories } = useNewsCategories();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
                            Trang chủ
                        </Link>
                        <ChevronRight size={16} className="text-gray-400" />
                        <span className="text-gray-900 font-medium">Tin tức</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary to-green-700 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
                        Tin Tức & Sự Kiện
                    </h1>
                    <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto">
                        Cập nhật tin tức mới nhất về sản phẩm, hướng dẫn làm vườn và nhiều hơn nữa
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                            {/* Search */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 mb-3">Tìm kiếm</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm tin tức..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setPage(1);
                                        }}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>

                            {/* Categories */}
                            {categories && categories.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3">Danh mục</h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(undefined);
                                                setPage(1);
                                            }}
                                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === undefined
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            Tất cả
                                        </button>
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => {
                                                    setSelectedCategory(category.id);
                                                    setPage(1);
                                                }}
                                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${selectedCategory === category.id
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                <span>{category.categoryName}</span>
                                                {category._count && (
                                                    <span className="text-xs opacity-75">
                                                        ({category._count.news})
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* News List */}
                    <main className="lg:col-span-3">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <p className="text-red-500">Có lỗi xảy ra khi tải tin tức</p>
                            </div>
                        ) : data ? (
                            <NewsList
                                news={data.data}
                                pagination={data.pagination}
                                onPageChange={setPage}
                            />
                        ) : null}
                    </main>
                </div>
            </div>
        </div>
    );
}
