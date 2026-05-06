import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    home: 'Home',
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
    shopNow: 'Shop Now',
    buyNow: 'Buy Now',
    newArrivals: 'New Arrivals',
    featured: 'Featured',
    categories: 'Categories',
    tshirt: 'T-Shirts',
    jeans: 'Jeans',
    jacket: 'Jackets',
    dress: 'Dresses',
    sweater: 'Sweaters',
    shorts: 'Shorts',
    shirt: 'Shirts',
    skirt: 'Skirts',
    allProducts: 'All Products',
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    price: 'Price',
    size: 'Size',
    color: 'Color',
    heroTitle: 'Discover Your Style',
    heroSubtitle: 'Premium fashion for everyone',
    menCollection: "Men's Collection",
    womenCollection: "Women's Collection",
    kidsCollection: "Kids' Collection",
    exploreCollection: 'Explore Collection',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    cart: 'Cart',
    search: 'Search',
    subscribe: 'Subscribe',
    newsletter: 'Subscribe to our newsletter',
    emailPlaceholder: 'Enter your email',
    footerText: 'Premium Fashion Store',
    allRights: 'All rights reserved',
    noProducts: 'No products found',
    loading: 'Loading...',
    checkout: 'Checkout',
    address: 'Address',
    phone: 'Phone Number',
    orderNow: 'Order Now',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    orderSuccess: 'Order placed successfully!',
    fullName: 'Full Name',
    selectSizeError: 'Please select a size before adding to cart',
    searchPlaceholder: 'Search for products...',
    noSearchResults: 'No products found for',
    searchResults: 'Search Results',
    discountProducts: 'Discount Products',
    homeCollection: 'Home Collection',
  },
  ru: {
    home: 'Дом',
    men: 'Мужчины',
    women: 'Женщины',
    kids: 'Дети',
    shopNow: 'Купить сейчас',
    buyNow: 'Купить сейчас',
    newArrivals: 'Новинки',
    featured: 'Рекомендуемые',
    categories: 'Категории',
    tshirt: 'Футболки',
    jeans: 'Джинсы',
    jacket: 'Куртки',
    dress: 'Платья',
    sweater: 'Свитера',
    shorts: 'Шорты',
    shirt: 'Рубашки',
    skirt: 'Юбки',
    allProducts: 'Все товары',
    addToCart: 'В корзину',
    viewDetails: 'Подробнее',
    price: 'Цена',
    size: 'Размер',
    color: 'Цвет',
    heroTitle: 'Откройте свой стиль',
    heroSubtitle: 'Премиальная мода для всех',
    menCollection: 'Мужская коллекция',
    womenCollection: 'Женская коллекция',
    kidsCollection: 'Детская коллекция',
    exploreCollection: 'Смотреть коллекцию',
    filterBy: 'Фильтр по',
    sortBy: 'Сортировать',
    login: 'Войти',
    logout: 'Выйти',
    profile: 'Профиль',
    cart: 'Корзина',
    search: 'Поиск',
    subscribe: 'Подписаться',
    newsletter: 'Подпишитесь на рассылку',
    emailPlaceholder: 'Введите email',
    footerText: 'Премиум Магазин Моды',
    allRights: 'Все права защищены',
    noProducts: 'Товары не найдены',
    loading: 'Загрузка...',
    checkout: 'Оформить заказ',
    address: 'Адрес',
    phone: 'Номер телефона',
    orderNow: 'Заказать сейчас',
    emptyCart: 'Ваша корзина пуста',
    total: 'Итого',
    orderSuccess: 'Заказ успешно оформлен!',
    fullName: 'Полное имя',
    selectSizeError: 'Пожалуйста, выберите размер перед добавлением в корзину',
    searchPlaceholder: 'Поиск товаров...',
    noSearchResults: 'Товары не найдены по запросу',
    searchResults: 'Результаты поиска',
    discountProducts: 'Товары со скидкой',
    homeCollection: 'Домашная коллекция'
  },
  tk: {
    home: 'Öý',
    men: 'Erkekler',
    women: 'Zenanlar',
    kids: 'Çagalar',
    shopNow: 'Satyn al',
    buyNow: 'Satyn al',
    newArrivals: 'Täze gelenler',
    featured: 'Saýlanan',
    categories: 'Kategoriýalar',
    tshirt: 'Futbolkalar',
    jeans: 'Jinsiler',
    jacket: 'Kurtka',
    dress: 'Köýnekler',
    sweater: 'Switerler',
    shorts: 'Şortikler',
    shirt: 'Köýnekçeler',
    skirt: 'Ýubkalar',
    allProducts: 'Ähli harytlar',
    addToCart: 'Sebede goş',
    viewDetails: 'Jikme-jik',
    price: 'Baha',
    size: 'Ölçeg',
    color: 'Reňk',
    heroTitle: 'Stiliňizi tapyň',
    heroSubtitle: 'Hemmeler üçin premium moda',
    menCollection: 'Erkekler kolleksiýasy',
    womenCollection: 'Zenanlar kolleksiýasy',
    kidsCollection: 'Çagalar kolleksiýasy',
    exploreCollection: 'Kolleksiýany gör',
    filterBy: 'Süzmek',
    sortBy: 'Tertiplemek',
    login: 'Girmek',
    logout: 'Çykmak',
    profile: 'Profil',
    cart: 'Sebet',
    search: 'Gözle',
    subscribe: 'Ýazylyň',
    newsletter: 'Habarlara ýazylyň',
    emailPlaceholder: 'Email giriziň',
    footerText: 'Premium Moda Dükany',
    allRights: 'Ähli hukuklar goragly',
    noProducts: 'Haryt tapylmady',
    loading: 'Ýüklenýär...',
    checkout: 'Sargyt etmek',
    address: 'Salgy',
    phone: 'Telefon belgisi',
    orderNow: 'Sargyt et',
    emptyCart: 'Sebediňiz boş',
    total: 'Jemi',
    orderSuccess: 'Sargyt üstünlikli ýerleşdirildi!',
    fullName: 'Doly adyňyz',
    selectSizeError: 'Sebede goşmazdan ozal ölçegi saýlaň',
    searchPlaceholder: 'Harytlary gözle...',
    noSearchResults: 'Gözleg boýunça haryt tapylmady',
    searchResults: 'Gözleg netijeleri',
    discountProducts: 'Arzanladyş harytlary',
    homeCollection: "Öý kolleksiýasy"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => translations[language][key] || key;

  const getProductName = (product) => {
    if (language === 'ru' && product.name_ru) return product.name_ru;
    if (language === 'tk' && product.name_tk) return product.name_tk;
    if (language === 'en' && product.name_en) return product.name_en;
    return product.name;
  };

  const getProductDescription = (product) => {
    if (language === 'ru' && product.description_ru) return product.description_ru;
    if (language === 'tk' && product.description_tk) return product.description_tk;
    if (language === 'en' && product.description_en) return product.description_en;
    return product.description;
  };

  const getProductType = (product) => {
    // Try translations first for standard categories (men, women, etc)
    if (product.category && translations[language][product.category]) {
      return translations[language][product.category];
    }

    if (language === 'ru' && product.type_ru) return product.type_ru;
    if (language === 'tk' && product.type_tk) return product.type_tk;
    if (language === 'en' && product.type_en) return product.type_en;

    return product.type;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getProductName, getProductDescription, getProductType }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}