from captcha.fields import CaptchaField
from django import forms

class EmailForm(forms.Form):
    name = forms.CharField(required=True, max_length=200, widget=forms.TextInput(attrs={'placeholder': 'Name'}))
    email = forms.EmailField(required=True, widget=forms.TextInput(attrs={'type': 'email', 'placeholder': 'Email'}))
    message = forms.CharField(required=True, widget=forms.Textarea(attrs={'placeholder': 'Message'}))
    captcha = CaptchaField()
