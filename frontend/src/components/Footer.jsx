import React from 'react';
import { useLanguage } from './LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-light tracking-wider mb-4">Second'O Zerlig</h2>
            <p className="text-stone-400 mb-6 max-w-md font-light">
              {t('footerText')}
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-medium">{t('newsletter')}</p>
              <div className="flex gap-2">
                <Input
                  placeholder={t('emailPlaceholder')}
                  className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 rounded-full"
                />
                <Button className="bg-amber-500 hover:bg-amber-600 text-stone-900 rounded-full px-6">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium mb-4">{t('categories')}</h3>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('men')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('women')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('kids')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('newArrivals')}</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-medium mb-4">Social</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/secondo_zerlig?igsh=MXFybHZ0d2xrcjk5NA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-stone-900 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@secondozerlig?_r=1&_d=e2glm3kjmje3m4&sec_uid=MS4wLjABAAAAgTJzi5GykWlPRivaXiehTvMz5oLEUFihFZ4qTrTHa7S2gizDjxwttqj9RIw1CRNv&share_author_id=7074794980937892869&sharer_language=ru&source=h5_m&u_code=d573d2glhci259&timestamp=1770980841&user_id=6668863404478742533&sec_user_id=MS4wLjABAAAAkH0ESgE1y_shDOrQsWDPxb5TqqYQpBZk3kUJ2j_Yx6sZBh2bM0FG80V7dmhMawaW&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7429529419108435717&share_link_id=f08fd28e-130b-44da-8ef4-88efd71f535a&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b6880%2Cb5836&social_share_type=5&enable_checksum=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-stone-900 transition-colors"
                title="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-8 pt-8 text-center text-stone-500 text-sm">
          © 2024 Second'O Zerlig. {t('allRights')}.
        </div>
      </div>
    </footer>
  );
}