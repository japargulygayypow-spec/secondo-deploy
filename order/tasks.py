from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Order


@shared_task
def send_new_order_email(order_id):

    try:
        order = Order.objects.get(id=order_id)

        # Формируем список товаров в заказе
        items_list = []
        for item in order.items.all():
            if item.variant_name:
                items_list.append(
                    f"  • {item.product_title} ({item.variant_name})\n"
                    f"    Количество: {item.quantity} шт.\n"
                    f"    Цена: {item.product_price} TMT"
                )
            else:
                items_list.append(
                    f"  • {item.product_title}\n"
                    f"    Количество: {item.quantity} шт.\n"
                    f"    Цена: {item.product_price} TMT"
                )
        
        items_str = "\n\n".join(items_list)
        
        # Формируем тему письма
        subject = f"🛍️ Новый заказ №{order.id} - SECOND'O ZERLIG"
        
        # Формируем текст письма
        message = f"""

        НОВЫЙ ЗАКАЗ №{order.id}


📋 ИНФОРМАЦИЯ О КЛИЕНТЕ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Имя: {order.full_name}
📞 Телефон: {order.phone_number}
📍 Адрес: {order.address}
🏠 Детали адреса: {order.address_detail or 'Не указано'}
💬 Примечание: {order.note or 'Нет'}

🛒 ТОВАРЫ В ЗАКАЗЕ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{items_str}

💰 ИТОГО К ОПЛАТЕ: {order.total_amount} TMT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Статус заказа: {order.get_status_display()}
🕐 Дата создания: {order.created_at.strftime('%d.%m.%Y %H:%M')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.SELLER_EMAIL],
            fail_silently=False,
        )

        return f"Email успешно отправлен для заказа №{order_id}"

    except Order.DoesNotExist:
        return f"Заказ №{order_id} не найден"
    except Exception as e:
        return f"Ошибка при отправке email для заказа №{order_id}: {str(e)}"
