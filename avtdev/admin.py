from django.contrib import admin

# Register your models here.
from .models import Development, Info, Message

admin.site.register(Development)
admin.site.register(Info)
admin.site.register(Message)