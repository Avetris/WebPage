
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = 'avtdev'
urlpatterns = [
    path('', views.Index, name="index" ),
    path('policy_privacy/', views.Policy_Privacy, name="policy_privacy" )
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
