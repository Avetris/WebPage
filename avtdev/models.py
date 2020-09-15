from avtdev.storage import OverwriteStorage
from django import forms
from djongo import models

URL_TYPES = [
    ('play_on_web', 'play_on_web'),
    ('play_store', 'play_store'),
    ('apple_store', 'apple_store'),
    ('web', 'web'),
    ('github', 'github'),
    ('linkedin', 'linkedin')
]

def change_filename(instance, filename):
    ext = filename.split('.')[-1].lower()
    return 'developments/{}{}'.format(instance.name, '.'+ext)

class Url(models.Model):
    type = models.CharField(max_length=20, choices=URL_TYPES, primary_key = True)
    url = models.CharField(max_length=2048)
    active = models.BooleanField()
    htmlClass = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=30, blank=True, null=True)

    objects = models.DjongoManager()

    class Meta:
        abstract = True

class LanguageField(models.ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)

class PlatformField(models.ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)

class StringListField(forms.CharField):
    def prepare_value(self, value):
        if value is None:
            return ''
        return ', '.join(value)

    def to_python(self, value):
        if not value:
            return []
        return [item.strip() for item in value.split(',')]

class Development(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    image = models.ImageField(upload_to=change_filename, storage=OverwriteStorage())
    description = models.TextField(max_length=4000)
    is_application = models.BooleanField()
    platforms = PlatformField()
    languages = LanguageField()
    error = models.CharField(max_length=2000, blank=True, null=True)
    comments = models.CharField(max_length=2000, blank=True, null=True)
    urls = models.ArrayField(
        model_container=Url,
        null=True, blank=True
    )
    objects = models.DjongoManager()

class Info(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    description = models.TextField(max_length=4000)
    email = models.CharField(max_length=1000)
    urls = models.ArrayField(
        model_container=Url,
        null=True, blank=True
    )
    privacy_policy = models.TextField(max_length=10000)

class Message(models.Model):
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=300, primary_key=True)
    message = models.CharField(max_length=4000)
    timestamp = models.DateTimeField()