import React from 'react';
import { useLanguage } from './LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const clothingTypes = ['tshirt', 'jeans', 'jacket', 'dress', 'sweater', 'shorts', 'shirt', 'skirt'];

export default function CategoryFilter({ selectedType, onTypeChange, availableTypes }) {
  const { t } = useLanguage();
  
  const typesToShow = availableTypes || clothingTypes;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant={selectedType === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTypeChange('all')}
        className={`rounded-full px-6 transition-all ${
          selectedType === 'all' 
            ? 'bg-stone-900 text-white hover:bg-stone-800' 
            : 'border-stone-300 hover:border-stone-900 hover:bg-stone-50'
        }`}
      >
        {t('allProducts')}
      </Button>
      
      {typesToShow.map((type) => (
        <motion.div
          key={type}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={selectedType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTypeChange(type)}
            className={`rounded-full px-6 transition-all ${
              selectedType === type 
                ? 'bg-stone-900 text-white hover:bg-stone-800' 
                : 'border-stone-300 hover:border-stone-900 hover:bg-stone-50'
            }`}
          >
            {t(type)}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}