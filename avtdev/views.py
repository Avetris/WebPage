from datetime import datetime

from django.shortcuts import render

from avtdev.forms import EmailForm
from avtdev.models import Development, Info, Message


def checkForm(form):
    submitted = False
    if form.is_valid():
        submitted = True
        msg = Message(form['name'].data, form['email'].data, form['message'].data, datetime.now())
        msg.save()
        form.clean()
    return submitted, form

def Index(request):
    developments = Development.objects.filter()
    applications = []
    other_developments = []
    submitted = False
    for development in developments:
        if development.is_application:
            applications.append(development)
        else:
            other_developments.append(development)

    if request.method == 'POST':
        submitted, form = checkForm(EmailForm(request.POST))
        if submitted:
            pass
    else:
        form = EmailForm()

    context = {
        'applications': applications,
        'other_developments': other_developments,
        'information': Info.objects.get(),
        'submitted': submitted,
        'form': form
    }

    return render(request, 'avtdev/index.html', context)

def Policy_Privacy(request):
    submitted = False
    if request.method == 'POST':
        submitted, form = checkForm(EmailForm(request.POST))
        if submitted:
            pass
    else:
        form = EmailForm()
    context = {
        'information': Info.objects.get(),
        'submitted' : submitted,
        'form': form
    }
    return render(request, 'avtdev/policy_privacy.html', context)
