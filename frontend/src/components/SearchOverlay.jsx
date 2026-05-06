import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/LanguageContext';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchOverlay({ children }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white border-none shadow-2xl overflow-hidden top-[20%] translate-y-0">
        <DialogHeader className="p-6 border-b">
          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full">
            <Search className="w-5 h-5 text-stone-400" />
            <Input
              autoFocus
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none focus-visible:ring-0 text-lg p-0 h-auto bg-transparent w-full"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <DialogTitle className="sr-only">{t('search')}</DialogTitle>
          <DialogDescription className="sr-only">
            Type your search query and press Enter.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
