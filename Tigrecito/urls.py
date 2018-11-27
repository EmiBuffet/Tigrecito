"""Tigrecito URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from tournament import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls, ),
    path('', views.home, name="home"),
    path('torneo/', views.torneo, name="torneo"),
    path('contacto/', views.contacto, name="contacto"),
    path('reglamento/', views.show_pdf, name="reglamento"),
    path('lista_buena_fe/', views.show_pdf_buenafe, name="lista_buena_fe"),
    path('clubes', views.clubes, name='clubes'),
    path('categoria/<str:categoria>', views.categoria, name='categoria'),
    path('partidos/', views.partidos, name='partidos'),
    path('api/partidos/<str:club>/<str:categoria>', views.ListPartidos, name='partidos_club_categoria'),
    path('api/partidos', views.ListarTodos, name="todos_partidos"),
    path('api/clubes', views.CategoriasClub, name="api_clubes"),
    path('partido/equipo/<str:clubName>/<str:clubId>/<str:categoryId>', views.partidosEquipo)
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + \
                   static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
