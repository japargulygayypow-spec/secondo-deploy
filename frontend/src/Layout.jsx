import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, ShoppingBag, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import CartSheet from '@/components/CartSheet';
import InlineSearch from '@/components/InlineSearch';
import logo from '@/assets/logo.png';

function Header() {
  const { t } = useLanguage();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), page: 'home' },
    { name: t('men'), page: 'Men' },
    { name: t('women'), page: 'Women' },
    { name: t('kids'), page: 'Kids' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('')} className="flex-shrink-0">
              <img src={logo} alt="SECOND'O ZERLIG" className="h-28 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                >
                  <Button
                    variant="ghost"
                    className="text-base font-medium text-stone-700 hover:text-amber-500 hover:bg-amber-50 px-6"
                  >
                    {link.name}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Desktop Search */}
            <div className="hidden lg:block flex-1 max-w-[500px] mx-6">
              <InlineSearch />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />



              <CartSheet>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-stone-700 hover:text-amber-500 relative"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </CartSheet>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-stone-700"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Access different categories and pages of the store.
                  </SheetDescription>
                  <div className="flex flex-col h-full pt-8">
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.page}
                          to={createPageUrl(link.page)}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-lg font-light text-stone-900 hover:text-amber-500 transition-colors py-2 border-b border-stone-100"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="w-full pb-2 lg:hidden">
            <InlineSearch />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-36 lg:pt-24">{children}</main>
      </div>
    </LanguageProvider>
  );
}