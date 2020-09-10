
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = 'games'
urlpatterns = [
    path('games/pacman', views.Pacman, name="pacman" ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
