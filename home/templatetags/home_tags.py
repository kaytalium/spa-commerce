from django.contrib.humanize.templatetags.humanize import intcomma
from django import template
register = template.Library()

from ..models import Categories, Submenu, Item
# Create your views here.
subcategories = Submenu.objects.all()
categories = Categories.objects.all()

context = {
    'subcategories': subcategories,
    'categories' :categories    
}

@register.filter
def peramount( value, arg ):
    try:
        value = float( value )
        arg = int( arg )
        price = (value - ((value*arg) / 100))
        dollars = round(float(price), 2)
        if arg: return "$%s%s" % (intcomma(int(dollars)), ("%0.2f" % dollars)[-3:])
    except: pass
    return ''

@register.filter
def percentage(value):
    try:
        value = float(value)
        return value / 10
    except: pass
    return 0.2

@register.filter
def ampersand(value):
    try:
        value = value.replace('&','and')
        value = value.replace(' ','_')
        return "%s" % value
    except: pass
    return ''

@register.inclusion_tag('home/include/latest_deals.html')
def show_latest_deals():
    return {'latest_deals':Item.objects.all()}

@register.inclusion_tag('home/include/trending.html')
def show_trending_deals():
    return {'items':Item.objects.all().filter(promoitem=True)}

@register.inclusion_tag('home/include/header.html')
def page_head(title):
    return {'title':title}

@register.inclusion_tag('home/include/footer.html')
def page_footer():
    return {}

@register.inclusion_tag('product/include/item.html')
def product_item(**kwargs):
    item = kwargs['product']
    return {'item':item, 'md_size':kwargs['mdsize'], 'grid_num':kwargs['gridnum']}

@register.inclusion_tag('home/include/menu.html')
def site_menu():
    return context
