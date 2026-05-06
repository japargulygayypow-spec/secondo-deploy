export const products = [
    // Men's Collection
    {
        id: 'm1',
        name: 'Classic White T-Shirt',
        name_ru: 'Классическая белая футболка',
        name_tk: 'Klassyk ak futbolka',
        description: 'Premium cotton t-shirt with a comfortable fit. Perfect for layering or wearing on its own. Made from 100% organic cotton.',
        description_ru: 'Футболка из премиального хлопка с комфортной посадкой. Идеально подходит для многослойных образов или как самостоятельный элемент гардероба. Изготовлена из 100% органического хлопка.',
        description_tk: 'Premium pagta futbolka, oňaýly oturyşy bilen. Gatlakly geýmek ýa-da özbaşdak geýmek üçin ajaýyp. 100% organiki pagtadan ýasaldy.',
        price: 25.00,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'
        ],
        category: 'men',
        type: 'tshirt',
        featured: true
    },
    {
        id: 'm2',
        name: 'Slim Fit Blue Jeans',
        name_ru: 'Узкие синие джинсы',
        name_tk: 'Gök jinsi balak',
        description: 'Durable and stylish slim fit jeans for everyday wear. Features a classic five-pocket design and a hint of stretch for comfort.',
        description_ru: 'Прочные и стильные узкие джинсы для повседневной носки. Классический пятикарманный дизайн и небольшая эластичность для комфорта.',
        description_tk: 'Gündelik geýmek üçin çydamly we owadan jinsi balak. Klassyk bäş jübi dizaýny we oňaýlylyk üçin birneme süýünýän matasy bar.',
        price: 55.00,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
            'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
            'https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800&q=80'
        ],
        category: 'men',
        type: 'jeans',
        featured: false
    },
    {
        id: 'm3',
        name: 'Leather Bomber Jacket',
        name_ru: 'Кожаная куртка-бомбер',
        name_tk: 'Deri bomber kurtka',
        description: 'Classic leather jacket for a rugged look. Crafted from high-quality leather with a soft lining for warmth.',
        description_ru: 'Классическая кожаная куртка для мужественного образа. Изготовлена из высококачественной кожи с мягкой подкладкой для тепла.',
        description_tk: 'Goç ýigitler üçin klassyk deri kurtka. Ýokary hilli deriden ýasalan, ýylylyk üçin ýumşak astarly.',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80',
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
            'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&q=80',
            'https://images.unsplash.com/photo-1521223890158-f9f7ad397395?w=800&q=80'
        ],
        category: 'men',
        type: 'jacket',
        featured: true
    },
    {
        id: 'm4',
        name: 'Wool Blend Sweater',
        name_ru: 'Свитер из шерсти',
        name_tk: 'Ýüň garyşykly switer',
        description: 'Warm and cozy sweater for cold days. A blend of wool and synthetic fibers for durability and softness.',
        description_ru: 'Теплый и уютный свитер для холодных дней. Смесь шерсти и синтетических волокон для прочности и мягкости.',
        description_tk: 'Sowuk günler üçin ýyly we oňaýly switer. Çydamlylyk we ýumşaklyk üçin ýüň we sintetiki süýümleriň garyndysy.',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800&q=80',
            'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
        ],
        category: 'men',
        type: 'sweater',
        featured: false
    },

    // Women's Collection
    {
        id: 'w1',
        name: 'Floral Summer Dress',
        name_ru: 'Летнее платье с цветочным принтом',
        name_tk: 'Gülli tomus köýnegi',
        description: 'Light and airy dress perfect for summer outings. Features a beautiful floral pattern and a flattering silhouette.',
        description_ru: 'Легкое и воздушное платье, идеально подходящее для летних прогулок. Красивый цветочный принт и подчеркивающий фигуру силуэт.',
        description_tk: 'Tomus gezelençleri üçin ýeňil we hawa geçirýän köýnek. Owadan gülli nagyşlary we göze ýakymly keşbi bar.',
        price: 40.00,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
            'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80'
        ],
        category: 'women',
        type: 'dress',
        featured: true
    },
    {
        id: 'w2',
        name: 'High-Waisted Skirt',
        name_ru: 'Юбка с высокой талией',
        name_tk: 'Belent billi ýubka',
        description: 'Elegant skirt that pairs well with any top. Made from a comfortable fabric with a slight sheen.',
        description_ru: 'Элегантная юбка, которая хорошо сочетается с любым верхом. Изготовлена из комфортной ткани с легким блеском.',
        description_tk: 'Islendik köýnekçe bilen gowy görünýän nepis ýubka. Ýeňil lowurdawuk oňaýly matadan ýasaldy.',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
            'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80',
            'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?w=800&q=80',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80'
        ],
        category: 'women',
        type: 'skirt',
        featured: false
    },
    {
        id: 'w3',
        name: 'Silk Blouse',
        name_ru: 'Шелковая блузка',
        name_tk: 'Ýüpek bluzka',
        description: 'Sophisticated silk blouse for formal occasions. Features a delicate texture and a timeless design.',
        description_ru: 'Изысканная шелковая блузка для официальных мероприятий. Нежная текстура и вневременной дизайн.',
        description_tk: 'Resmi çäreler üçin nepis ýüpek bluzka. Näzik dokumasy we hiç wagt modadan gaçmaýan dizaýny bar.',
        price: 65.00,
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
            'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80',
            'https://images.unsplash.com/photo-1564485371866-49728bfcd155?w=800&q=80',
            'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80'
        ],
        category: 'women',
        type: 'shirt',
        featured: true
    },
    {
        id: 'w4',
        name: 'Denim Jacket',
        name_ru: 'Джинсовая куртка',
        name_tk: 'Jinsi kurtka',
        description: 'Versatile denim jacket for a casual look. A must-have piece for any wardrobe, perfect for transitional weather.',
        description_ru: 'Универсальная джинсовая куртка для повседневного образа. Необходимая вещь в любом гардеробе, идеально подходит для переходной погоды.',
        description_tk: 'Gündelik görnüş üçin köptaraply jinsi kurtka. Islendik garderob üçin zerur zat, çalşykly howa üçin ajaýyp.',
        price: 50.00,
        image: 'https://images.unsplash.com/photo-1529139513466-42016c421816?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1529139513466-42016c421816?w=800&q=80',
            'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
            'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80',
            'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&q=80'
        ],
        category: 'women',
        type: 'jacket',
        featured: false
    },

    // Kids' Collection
    {
        id: 'k1',
        name: 'Graphic Print T-Shirt',
        name_ru: 'Футболка с графическим принтом',
        name_tk: 'Suratly futbolka',
        description: 'Fun and colorful t-shirt for active kids. Features a playful graphic and soft cotton fabric.',
        description_ru: 'Веселая и яркая футболка для активных детей. Игривый принт и мягкая хлопковая ткань.',
        description_tk: 'Işjeň çagalar üçin gyzykly we reňkli futbolka. Oýunçy suratly we ýumşak pagta matasy bar.',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1519234221762-fbf637fde159?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1519234221762-fbf637fde159?w=800&q=80',
            'https://images.unsplash.com/photo-1503919919749-646ddc46af91?w=800&q=80',
            'https://images.unsplash.com/photo-1519278401-1b1092b8c256?w=800&q=80',
            'https://images.unsplash.com/photo-1519457431-7571f0182746?w=800&q=80'
        ],
        category: 'kids',
        type: 'tshirt',
        featured: true
    },
    {
        id: 'k2',
        name: 'Comfortable Shorts',
        name_ru: 'Удобные шорты',
        name_tk: 'Oňaýly şortik',
        description: 'Soft and breathable shorts for playtime. Designed for maximum comfort and ease of movement.',
        description_ru: 'Мягкие и дышащие шорты для игр. Разработаны для максимального комфорта и свободы движений.',
        description_tk: 'Oýun wagty üçin ýumşak we hawa geçirýän şortik. Maksimum oňaýlylyk we hereket erkinligi üçin dizaýn edildi.',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1519457431-7571f0182746?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1519457431-7571f0182746?w=800&q=80',
            'https://images.unsplash.com/photo-1519234221762-fbf637fde159?w=800&q=80',
            'https://images.unsplash.com/photo-1503919919749-646ddc46af91?w=800&q=80',
            'https://images.unsplash.com/photo-1519278401-1b1092b8c256?w=800&q=80'
        ],
        category: 'kids',
        type: 'shorts',
        featured: false
    },
    {
        id: 'k3',
        name: 'Hooded Sweatshirt',
        name_ru: 'Толстовка с капюшоном',
        name_tk: 'Kapýuşonli switer',
        description: 'Warm hoodie for outdoor adventures. Features a cozy hood and a front pocket for essentials.',
        description_ru: 'Теплая толстовка для приключений на свежем воздухе. Уютный капюшон и передний карман для мелочей.',
        description_tk: 'Daşary çykmak üçin ýyly kapýuşonli switer. Oňaýly kapýuşony we zerur zatlar üçin öň jübi bar.',
        price: 28.00,
        image: 'https://images.unsplash.com/photo-1503919919749-646ddc46af91?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1503919919749-646ddc46af91?w=800&q=80',
            'https://images.unsplash.com/photo-1519234221762-fbf637fde159?w=800&q=80',
            'https://images.unsplash.com/photo-1519278401-1b1092b8c256?w=800&q=80',
            'https://images.unsplash.com/photo-1519457431-7571f0182746?w=800&q=80'
        ],
        category: 'kids',
        type: 'sweater',
        featured: true
    },
    {
        id: 'k4',
        name: 'Denim Overalls',
        name_ru: 'Джинсовый комбинезон',
        name_tk: 'Jinsi kombinezon',
        description: 'Classic denim overalls for a cute look. Durable denim fabric that can withstand active play.',
        description_ru: 'Классический джинсовый комбинезон для милого образа. Прочная джинсовая ткань, выдерживающая активные игры.',
        description_tk: 'Süýji görünmek üçin klassyk jinsi kombinezon. Işjeň oýunlara çydamly berk jinsi matasy.',
        price: 32.00,
        image: 'https://images.unsplash.com/photo-1519278401-1b1092b8c256?w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1519278401-1b1092b8c256?w=800&q=80',
            'https://images.unsplash.com/photo-1519234221762-fbf637fde159?w=800&q=80',
            'https://images.unsplash.com/photo-1503919919749-646ddc46af91?w=800&q=80',
            'https://images.unsplash.com/photo-1519457431-7571f0182746?w=800&q=80'
        ],
        category: 'kids',
        type: 'jeans',
        featured: false
    }
];

export const mockUser = {
    id: 'u1',
    full_name: 'Demo User',
    email: 'demo@example.com'
};
