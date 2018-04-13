from django.contrib.humanize.templatetags.humanize import intcomma
from django import template
from re import sub
from decimal import Decimal

register = template.Library()

from ..models import Categories, Submenu, Item, ItemType, Discount, Brand

@register.inclusion_tag('product/include/filters.html')
def product_filters(submenu):
    return {'subcat':submenu}

@register.inclusion_tag('product/include/filter_type.html')
def filter_type(menucat):
    menu = Submenu.objects.get(name=menucat)
    types = ItemType.objects.filter(submenu=menu.id)
    return {'types':types, "submenu": menucat}

@register.inclusion_tag('product/include/product_type.html')
def product_type(menucat):
    menu = Submenu.objects.get(name=menucat)
    types = ItemType.objects.filter(submenu=menu.id)
    return {'types':types}

@register.inclusion_tag('product/include/filter_brand.html')
def filter_brand(menucat):
    menu = Submenu.objects.get(name=menucat)
    items = Item.objects.filter(submenu=menu.id)
   
    s = []
    for item in items:
        if item.brand:
            s.append(item.brand.name)
        
    brands = set(s)
    return {'brands':brands}

@register.inclusion_tag('product/include/filter_price.html')
def filter_price(menucat):
    menu = Submenu.objects.get(name=menucat)
    items = Item.objects.filter(submenu=menu.id)

    cost = 0
    gten = 0
    g25 = 0
    g40 = 0
    g55 = 0
    others = 0
    for item in items:
        if item.promoitem:
            cost = float(item.price) - (float(item.price) * item.promopercentage) / 100
        else:
            cost = float(item.price)
        
        # print(item.name,': ',cost, )
        
        if cost >= 10000 and cost < 25000:
            gten += 1
        elif cost > 25000 and cost < 40000:
            g25 += 1
        elif cost > 40000 and cost < 55000:
            g40 += 1
        elif cost > 55000 and cost < 70000:
            g55 += 1
        else:
            others += 1  
    
    prices = [
        {'name':'sbdsfhdfsd3502398qwbia23',"range":'10,000 - 25,000',"quantity":gten},
        {"range":'25,000 - 40,000','quantity':g25},
        {"range":'40,000 - 55,000','quantity':g40},
        {"range":'55,000 - 70,000','quantity':g55},
        {"range":'others','quantity':others}
    ]

    return {'prices':prices}

@register.inclusion_tag('product/include/filter_discount.html')
def filter_discount(menucat):
    menu = Submenu.objects.get(name=menucat)
    discounts = Discount.objects.all()
    items = Item.objects.filter(submenu=menu.id)

    obj = []
    for discount in discounts:
        count = 0
       
        for item in items:
            if item.discount_id == discount.id:
                count += 1

        if discount.discountrange != 'none':
            obj.append({'name':discount.name, 'range':discount.discountrange,'quantity':count})

    # print(obj)
    


    
    return {'discounts':obj[::-1]}


@register.inclusion_tag('product/include/product_detail.html')
def product_detail(product_item):
    return {'item':product_item}
