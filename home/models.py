from django.db import models
from datetime import datetime
from djmoney.models.fields import MoneyField

# Create your models here.

class Categories(models.Model):
    name = models.CharField(max_length=200)
    date_created = models.DateTimeField(default=datetime.now,blank=True)
    image = models.FileField(null=True, blank=True)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name_plural = "Categories"
    
class Submenu(models.Model):
    name = models.CharField(max_length=150)
    bannerImage = models.FileField(null=True, blank=True)
    category = models.ForeignKey(Categories,'submenu',"yes")
    def __str__(self):
        return self.name
    class Meta:
        verbose_name_plural = "Submenu"

class Promo(models.Model):
    name = models.CharField(default="Trending",max_length=150)
    def __str__(self):
        return self.name

class ItemType(models.Model):
    name = models.CharField(max_length=200)
    submenu = models.ForeignKey(Submenu, 'Itemtype', 'yes',null=True,blank=True)

    def __str__(self):
        return self.name

class Discount(models.Model):
    name = models.CharField(max_length=150)
    discountrange = models.CharField(max_length=150)

    def __str__(self):
        return self.discountrange

class Brand(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

class Item(models.Model):
    name = models.CharField(max_length=200)
    brand = models.ForeignKey(Brand,'item', 'no',null=True,blank=True)
    #brans = models.ManyToManyField(self,)
    image = models.FileField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    promoitem = models.BooleanField(default=False)
    promocategory = models.ForeignKey(Promo,'item',"yes",null=True,blank=True)
    promopercentage = models.IntegerField(default=0)
    discount = models.ForeignKey(Discount,'item','no',null=True,blank=True)
    submenu = models.ForeignKey(Submenu, 'item','no')
    producttype = models.ForeignKey(ItemType, 'itemtype','yes',null=True,blank=True) 
    price = MoneyField(
        decimal_places=2,
        default=0,
        default_currency='USD',
        max_digits=11,
    )
    ratings = models.DecimalField(max_digits=1, decimal_places=0,default=0)

    def __str__(self):
        return self.name

class Newsletter(models.Model):
    email = models.EmailField()

    def __str__(self):
        return self.email