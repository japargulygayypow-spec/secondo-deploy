import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowUpRight } from 'lucide-react';

export default function CollectionCard({ title, image, link, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={createPageUrl(link)} className="group block relative overflow-hidden rounded-2xl aspect-[4/5]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="flex items-end justify-between gap-2">
            <h3 className="text-lg sm:text-2xl md:text-3xl font-light text-white leading-tight">{title}</h3>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex-shrink-0 flex items-center justify-center group-hover:bg-amber-400 transition-colors">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-stone-900 group-hover:rotate-45 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}