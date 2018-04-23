from django.contrib import admin

# Register your models here.
from .models import Categories, Submenu, Item, Promo, ItemType, Discount, Brand, Newsletter

admin.site.register(Categories)
admin.site.register(Submenu)
admin.site.register(Promo)
admin.site.register(Item)
admin.site.register(ItemType)
admin.site.register(Discount)
admin.site.register(Brand)
admin.site.register(Newsletter)