import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/LanguageContext';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InlineSearch({ className }) {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSearch} className="relative w-full">
                <Input
                    placeholder={t('searchPlaceholder')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-6 pr-14 h-12 rounded-full border-stone-200 focus:border-amber-500 focus:ring-amber-500 bg-stone-50 text-base shadow-sm"
                />

                {/* Clear Button - Positioned to the left of the search button */}
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-14 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* Submit Button - Inside the bar on the right */}
                <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 aspect-square bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                    title={t('search')}
                >
                    <Search className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
