from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from product.models import Category, Size, Product, ProductVariant


PRODUCTS = [
    {
        "title": "Old Money Classic Suit",
        "category": "suits",
        "price": Decimal("1890.00"),
        "discount": Decimal("10.00"),
        "stock": {"M": 8, "L": 9, "XL": 6},
        "description": "Structured wool blend suit with clean lapel lines, tailored for timeless old-money elegance.",
        "image": "https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg",
    },
    {"title": "Textured Knit Suit", "category": "suits", "price": Decimal("1650.00"), "discount": Decimal("0.00"), "stock": {"S": 5, "M": 8, "L": 8, "XL": 4}, "description": "Soft textured knit two-piece set that balances formal shape with relaxed comfort.", "image": "https://images.pexels.com/photos/977968/pexels-photo-977968.jpeg"},
    {"title": "Muslin Summer Suit", "category": "suits", "price": Decimal("1490.00"), "discount": Decimal("8.00"), "stock": {"M": 7, "L": 7, "XL": 5, "XXL": 3}, "description": "Breathable muslin suit in a light palette designed for warm-weather refinement.", "image": "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg"},
    {"title": "Premium Cotton Shirt", "category": "shirts", "price": Decimal("390.00"), "discount": Decimal("0.00"), "stock": {"S": 10, "M": 12, "L": 12, "XL": 10, "XXL": 6}, "description": "Long-staple cotton shirt with crisp collar and versatile fit for formal or smart-casual looks.", "image": "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg"},
    {"title": "Classic Trousers", "category": "trousers", "price": Decimal("520.00"), "discount": Decimal("5.00"), "stock": {"S": 7, "M": 10, "L": 10, "XL": 8}, "description": "Flat-front classic trousers with premium drape and everyday wear durability.", "image": "https://images.pexels.com/photos/532588/pexels-photo-532588.jpeg"},
    {"title": "Leather Jacket", "category": "outerwear", "price": Decimal("1280.00"), "discount": Decimal("12.00"), "stock": {"M": 5, "L": 6, "XL": 5, "XXL": 3}, "description": "Premium leather outer layer with clean hardware and modern masculine silhouette.", "image": "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg"},
    {"title": "Refined Polo Set", "category": "polo", "price": Decimal("740.00"), "discount": Decimal("0.00"), "stock": {"S": 8, "M": 10, "L": 10, "XL": 8}, "description": "Short-sleeve polo with matching trousers for polished off-duty styling.", "image": "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg"},
    {"title": "Shirt and Trousers Set", "category": "sets", "price": Decimal("890.00"), "discount": Decimal("6.00"), "stock": {"M": 7, "L": 9, "XL": 8}, "description": "Matched shirt-and-trouser set curated for balanced texture and color harmony.", "image": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"},
    {"title": "Sweater Lounge Set", "category": "knitwear", "price": Decimal("810.00"), "discount": Decimal("0.00"), "stock": {"S": 6, "M": 9, "L": 9, "XL": 7}, "description": "Soft-gauge sweater and jogger pairing with clean premium finish.", "image": "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg"},
    {"title": "Casual Everyday Outfit", "category": "sets", "price": Decimal("670.00"), "discount": Decimal("4.00"), "stock": {"S": 8, "M": 10, "L": 10, "XL": 8, "XXL": 5}, "description": "Minimal everyday combination engineered for effortless movement and premium casual style.", "image": "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg"},
]


class Command(BaseCommand):
    help = "Seed catalog with premium menswear products, categories, sizes and variants"

    @transaction.atomic
    def handle(self, *args, **options):
        categories = {
            "suits": "Suits",
            "shirts": "Shirts",
            "trousers": "Trousers",
            "polo": "Polo",
            "knitwear": "Knitwear",
            "outerwear": "Outerwear",
            "sets": "Sets",
        }
        category_objs = {}
        for slug, name in categories.items():
            category, _ = Category.objects.update_or_create(slug=slug, defaults={"name": name, "parent": None})
            category_objs[slug] = category

        sizes = ["S", "M", "L", "XL", "XXL"]
        size_objs = {}
        for order, size_name in enumerate(sizes, start=1):
            size, _ = Size.objects.update_or_create(
                name=size_name,
                size_type=Size.SizeType.CLOTH,
                defaults={"order": order},
            )
            size_objs[size_name] = size

        for item in PRODUCTS:
            product, _ = Product.objects.update_or_create(
                title=item["title"],
                defaults={
                    "category": category_objs[item["category"]],
                    "description": item["description"],
                    "price": item["price"],
                    "discount": item["discount"],
                    "stock": sum(item["stock"].values()),
                    "is_active": True,
                    "image": item["image"],
                },
            )
            for size_name, stock in item["stock"].items():
                ProductVariant.objects.update_or_create(
                    product=product,
                    size=size_objs[size_name],
                    defaults={"stock": stock},
                )

        self.stdout.write(self.style.SUCCESS(f"Seed complete: {len(PRODUCTS)} products, {len(categories)} categories"))
