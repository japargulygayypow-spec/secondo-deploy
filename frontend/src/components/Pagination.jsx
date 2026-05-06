import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5; // Number of page buttons to show

        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        // Adjust start if we're near the end
        if (endPage - startPage < showPages - 1) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis and last page if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex flex-col items-center gap-4 py-8">
            {/* Page info */}
            <div className="text-sm text-stone-500">
                Page {currentPage} of {totalPages} ({totalItems} items)
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
            flex items-center gap-1 px-3 py-2 rounded-lg border transition-all
            ${currentPage === 1
                            ? 'border-stone-200 text-stone-300 cursor-not-allowed'
                            : 'border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400'
                        }
          `}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === '...') {
                            return (
                                <span key={`ellipsis-${index}`} className="px-2 text-stone-400">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`
                  min-w-[40px] h-10 px-3 rounded-lg border transition-all font-medium
                  ${page === currentPage
                                        ? 'bg-stone-900 text-white border-stone-900'
                                        : 'border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400'
                                    }
                `}
                                aria-label={`Go to page ${page}`}
                                aria-current={page === currentPage ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`
            flex items-center gap-1 px-3 py-2 rounded-lg border transition-all
            ${currentPage === totalPages
                            ? 'border-stone-200 text-stone-300 cursor-not-allowed'
                            : 'border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400'
                        }
          `}
                    aria-label="Next page"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
