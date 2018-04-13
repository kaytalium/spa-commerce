from django.shortcuts import render

from .models import Categories, Submenu, Item, ItemType
# Create your views here.
subcategories = Submenu.objects.all()
categories = Categories.objects.all()

context = {
    'subcategories': subcategories,
    'categories' :categories    
}

def flipspaces(name):
    
   if (name.isspace()):
       return name.replace(' ','_')
   else:
       return name.replace('_',' ')


def index(request):
     return render(request, 'home/base.html',context)

def products(request, cat, subcat):
    # getting the id of the submenu 
    # we must frist convert back to spaces and & sign
    subcat = subcat.replace('_',' ')
    subcat = subcat.replace(' and ',' & ')
    submenu = Submenu.objects.get(name=subcat)

    # filter all the items that coresponse to the submenu selected
    itemslist = Item.objects.filter(submenu=submenu.id)

    # filter all submenu items base on filter provided
    # There are four(4) points we can filter on 
    # 1. Price
    # 2. Discounts
    # 3. Types
    # 4. Brands
    # The filter will only do one at a time as this is a simple filter
    # therefore the calculations below will check if a filter is activated and change the itemlist to match the filtered list
    # Filter Type (ft)
    # Filter Price (fp)
    # Filter Discount (fd)
    # Filter Brand (fb)
    ft = request.GET.get('ft')
    fp = request.GET.get('fp')
    fd = request.GET.get('fd')
    fb = request.GET.get('fb')

    isFilter = False
    p = []
    if ft:
        ptype = ItemType.objects.get(name=ft)
        p = itemslist.filter(producttype=ptype.id)
    else:
        p = itemslist
    
    # return to the view the list of items from the submenu
    pagedata = {
        'itemlist': p,
        'category':cat,
        'subcategory': subcat,
        'submenu': submenu
    }
    
    return render(request, 'product/product.html', pagedata)

def login(request):
     return render(request, 'auth/login.html')

def register(request):
     return render(request, 'auth/register.html')

def checkout(request):
     return render(request, 'product/checkout.html')

def detail(request, cat, subcat, product):
    item = Item.objects.get(name=flipspaces(product))
    data = {
        'cat':cat,
        'subcat': subcat,
        'product':product,
        'item':item
    }
    
    return render(request, 'product/detail.html', data)