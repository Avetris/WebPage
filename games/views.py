from django.shortcuts import render

def Pacman(request):
    context = {}

    return render(request, 'games/pacman.html', context)