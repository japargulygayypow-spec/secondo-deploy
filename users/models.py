from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

class User(AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(_('Номер телефона'), max_length=8, unique=True)
    first_name = models.CharField(_('Имя'), max_length=50)
    last_name = models.CharField(_('Фамилия'), max_length=50)
    
    is_staff = models.BooleanField(_('Сотрудник'), default=False)
    is_active = models.BooleanField(_('Активен'), default=True)
    date_joined = models.DateTimeField(_('Дата регистрации'), auto_now_add=True)

    class Meta:
        verbose_name = _('Пользователь')
        verbose_name_plural = _('Пользователи')

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.phone_number