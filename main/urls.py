from django.urls import path
from . import views

urlpatterns = [
    path('mechanics/', views.mechanic_list, name='mechanic-list'),
    path('mechanics/create/', views.mechanic_create, name='mechanic-create'),
    path('mechanics/<int:pk>/update/', views.mechanic_update, name='mechanic-update'),

    path('appointments/', views.appointment_list, name='appointment-list'),
    path('appointments/create/', views.appointment_create, name='appointment-create'),
    path('appointments/<int:pk>/update/', views.appointment_update, name='appointment-update'),
]
