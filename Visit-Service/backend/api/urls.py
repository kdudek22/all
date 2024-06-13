from django.urls import path
from .views import *

urlpatterns = [
    path("services/", ServiceListApiView.as_view()),
    path("services/<int:pk>", ServiceApiView.as_view()),
    path("doctors/<str:pk>/availability_table/", AvailabilityTableApiView.as_view()),
    path("doctors/<str:pk>/services/", DoctorServiceListApiView.as_view()),
    path("doctors/<str:pk>/orders/", OrderListView.as_view()),
    path("customers/<str:pk>/orders/", OrderListView.as_view()),
    path("orders/<int:pk>/", OrderView.as_view()),
]

"""
    "services/" GET/POST
    "services/<int:pk>" GET/PATCH
    "doctors/<int:pk>/availability_table/" GET/POST/PUT
    "doctors/<int:pk>/services/" GET/POST
    "doctors/<int:pk>/orders/" GET
    "login/" - tymczasowy
    "customers/<int:pk>/orders/" GET
    "orders/<int:pk>/" POST

"""