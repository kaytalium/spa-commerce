from django.conf.urls import url
from . import views

urlpatterns = [
     url(r'^$',views.index, name='index'),
     url(r'index/$',views.index, name='index'),
     url(r'^product/(?P<cat>[-\w\s]+)/(?P<subcat>[\w\s]+)/$',views.products, name='product'),
     url(r'^product/(?P<cat>[-\w\s]+)/(?P<subcat>[\w\s]+)/(?P<product>[\w\s]+)/$',views.detail, name='details'),
     url(r'login/$',views.login, name='login'),
     url(r'register/$',views.register, name='register'),
     url(r'checkout/$',views.checkout, name='checkout')
   ]