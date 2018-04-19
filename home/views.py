from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response
# from django.template.loader import get_template
from django.template import Context, RequestContext, loader
import json 
from django.http.response import JsonResponse
from re import sub
from decimal import Decimal

from .models import Categories, Submenu, Item, ItemType, Brand, Discount
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
    ptype = []
    pbrand = []
    pdiscount = []
    activeFilters = {}
    # query string
    query = {}

    if ft:
        ptype = ItemType.objects.get(name=ft)
        set_if_not_none(query, 'producttype', ptype.id)
        set_if_not_none(activeFilters,'type',ptype.name)
    
    if fb:
        pbrand = Brand.objects.get(name=fb)
        set_if_not_none(query, 'brand', pbrand.id)
        set_if_not_none(activeFilters,'brand',pbrand.name)
    if fd:
        pdiscount = Discount.objects.get(discountrange=fd)
        # print('****************Discount ID: ',pdiscount.id)
        set_if_not_none(query, 'discount', pdiscount.id)
        set_if_not_none(activeFilters,'discount',pdiscount.name)

    #set_if_not_none(query, 'price__lte', 20000)
    # set_if_not_none(query, 'price__lte', 20000)
    

    p = itemslist.filter(**query)
    
    # print("THIS IS FROM THE VIEW.PY: ",ptype.name)
    # return to the view the list of items from the submenu
    pagedata = {
        'itemlist': p,
        'category':cat,
        'subcategory': subcat,
        'submenu': submenu,
        'activeFilters': activeFilters
        
    }
    
    return render(request, 'product.html', pagedata)

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
#  Utiliy class
def set_if_not_none(mapping, key, value):
    if value is not None:
        mapping[key] = value

def convertMoneyToInt(money):
    return Decimal(sub(r'[^\d.]', '', money))

def prepareSearchFilter(value):
        query = {}
        filterList = json.loads(value)
     
        for filters in filterList:
            print('Filter Values: ',filters['value'])
            if filters['filter'] == 'prices' and filters['value'] != 'others':
                limit = filters['value'].split(' - ')
                set_if_not_none(query,'price__gte',convertMoneyToInt(limit[0]))
                set_if_not_none(query,'price__lte',convertMoneyToInt(limit[1]))
            elif filters['filter'] == 'prices' and filters['value'] == 'others':
                set_if_not_none(query,'price__gte',70000)

       
        return query

def filter_search(request):
    # query criteria from user
    data = request.POST['filterGroup']

    # create search terms for the itemlist
    filters = prepareSearchFilter(data)

    # Due to the fact that no discounted price is stored in the database 
    # We have to create a new object with the list of new discounted prices 
    
    # all items from the database 
    itemslist = Item.objects.filter(**filters)    
    # print('Before process: ',itemslist)
    # for item in itemslist:
    #     cost  = float(item.price)
    #     if item.promoitem:
    #         cost = float(item.price) - (float(item.price)
    #                                     * item.promopercentage) / 100
    #         item.price = cost
        
    # for item in itemslist:
    #     print("Discount price: ",float(item.price))

    # itemslist = list(itemslist)
    # # newItemList = itemslist.objects.filter(**filters)
    # print("new List: ",itemslist)

    # load template and set the content for template
    t = loader.get_template('product_result.html')
    content = {'itemlist': itemslist}
   
    # setup a variable to return the result to the caller of this api 
    response_data = {}
    try:
        response_data['isResult'] = True
        response_data['resultCount'] = len(itemslist) 
        response_data['template'] = t.render(content)
    except:
        response_data['isResult'] = False
        response_data['resultCount'] = 0
    return JsonResponse(response_data)

    # return HttpResponse(response_data,content_type="application/json")

    