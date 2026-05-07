import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(231,214,198,0.45),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(199,169,122,0.30),transparent_45%),linear-gradient(125deg,#2B241E_0%,#4A3D33_40%,#7D6750_100%)]" />
      <div className="absolute inset-0 opacity-55">
        <div className="absolute -top-24 -left-20 w-[28rem] h-[28rem] rounded-full bg-[#F7F3EE]/20 blur-3xl animate-pulse" />
        <div className="absolute top-12 right-0 w-[24rem] h-[24rem] rounded-full bg-[#C7A97A]/25 blur-3xl animate-pulse" />
      </div>
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-light text-[#F7F3EE] mb-5 leading-tight">
            Eşiklere täzeden jan beriň
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-lg md:text-xl text-[#EEE7DD] mb-8 font-light max-w-2xl">
            Premium ideg, arassa stil we täze görnüş — Secondo Zerliq bilen her eşik täzeden gymmat görünýär.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex flex-wrap gap-4">
            <Link to={createPageUrl('Men')}><Button size="lg" className="bg-[#F7F3EE] text-[#2B241E] hover:bg-[#EEE7DD] rounded-full px-8 gap-2">Kolleksiýany gör <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link to={createPageUrl('HomeCategory')}><Button size="lg" variant="outline" className="border-[#F7F3EE] text-[#F7F3EE] hover:bg-[#F7F3EE]/10 rounded-full px-8">Harytlara geç</Button></Link>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F7F3EE] to-transparent" />
    </section>
  );
}
