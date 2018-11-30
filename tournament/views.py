from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from django.db.models import Q
from .models import Club, Category, Zone_Category, Matches, PlayOff
from . import serializers
from rest_framework import generics
import json
from .calculos import calculos_grupo


# Create your views here.
def home(request):
    return render(request, 'home.html', {'meta_title': 'Home'})


def torneo(request):
    # Usar el método .values() para obtener todo el objeto (con ID).
    categorias = Category.objects.all().values()
    categoriesInfo = []
    for categoryObj in categorias:
        club_counter = Club.objects.filter(category=categoryObj['id']).count()
        categoriesInfo.append({
            'category': categoryObj['description'],
            'club_category_counter': club_counter
        })
    context = {'context': categoriesInfo, 'meta_title': 'Torneo'}
    return render(request, 'torneo.html', context)


@ensure_csrf_cookie
def contacto(request):
    if request.method == 'POST':
        bodystr = request.body.decode('utf-8')
        bodyDic = json.loads(bodystr)
        if len(bodyDic["subject"]) > 0 and len(bodyDic["email"]) > 0 and len(bodyDic["message"]) > 0:
            returnValue = send_mail(
                bodyDic["subject"],
                "Email: " + bodyDic["email"] + "\n Mensaje: \n" + bodyDic["message"],
                bodyDic["email"],
                [settings.EMAIL_HOST_USER],
                fail_silently=False,
            )
            if returnValue == 1:
                return JsonResponse({'wasSended': 'true'})
            else:
                return JsonResponse({'wasSended': 'false',
                                     'errorMessage': 'No pudimos enviar el correo, por favor intentelo nuevamente.'})

        else:
            return JsonResponse({'wasSended': 'false', 'errorMessage': 'Completar campos obligatorios'})
    else:
        return render(request, 'contacto.html', {'meta_title': 'Contacto'})


def show_pdf(request):
    with open('static/Pdfs/ReglamentoTigrecito2018.pdf', 'rb') as pdf:
        response = HttpResponse(pdf.read(), content_type='application/pdf')
        response['Content-Disposition'] = 'inline;filename=some_file.pdf'
        return response
    pdf.closed


def show_pdf_buenafe(request):
    with open('static/Pdfs/LISTA_DE_BUENA_FE.pdf', 'rb') as pdf:
        response = HttpResponse(pdf.read(), content_type='application/pdf')
        response['Content-Disposition'] = 'inline;filename=some_file.pdf'
        return response
    pdf.closed


def clubes(request):
    clubs = Club.objects.all()
    # TODO: Obtener categoryId de cada CLUB.
    context = {'clubs': clubs, 'meta_title': 'Clubes'}
    return render(request, 'clubes.html', context)


def categoria(request, categoria):
    # categoria tiene el numero de la categoria
    # idCategoria trae el ID para ese numero
    idCategoria = Category.objects.get(description=categoria)

    # clubs_categoria, trae todos los clubes para esa categoria
    clubs_categoria = Club.objects.all().filter(category=idCategoria)

    # zona_categoria, trae todas las zonas con sus respectivos equipos para la categoria
    zona_categoria = Zone_Category.objects.all().filter(idCategory=idCategoria)

    # traer todos los partidos de playoff de la categoria
    partidos_playoff = PlayOff.objects.all().filter(idMatch__idCategory=idCategoria)

    # filtra si es copa de oro o de plata
    playoff_gold = partidos_playoff.filter(isGold=True)
    playoff_silver = partidos_playoff.filter(isGold=False)

    # seperar partidos de cuertos, semis, 3er puesto y final.
    cuartosGold = playoff_gold.filter(idTypeOfMatch__description="Cuarto A") | playoff_gold.filter(
        idTypeOfMatch__description="Cuarto B") | playoff_gold.filter(
        idTypeOfMatch__description="Cuarto C") | playoff_gold.filter(idTypeOfMatch__description="Cuarto D")
    semisGold = playoff_gold.filter(idTypeOfMatch__description="Semifinal A") | playoff_gold.filter(
        idTypeOfMatch__description="Semifinal B")
    tercerPuestoGold = playoff_gold.filter(idTypeOfMatch__description="Tercer puesto")
    finalGold = playoff_gold.filter(idTypeOfMatch__description="Final")
    goldTrophy = {'cuartos': cuartosGold.order_by('idTypeOfMatch'), 'semis': semisGold,
                  'tercerPuesto': tercerPuestoGold, 'final': finalGold}

    # copa de plata
    cuartosSilver = playoff_silver.filter(idTypeOfMatch__description="Cuarto A") | playoff_silver.filter(
        idTypeOfMatch__description="Cuarto B") | playoff_silver.filter(
        idTypeOfMatch__description="Cuarto C") | playoff_silver.filter(idTypeOfMatch__description="Cuarto D")
    semisSilver = playoff_silver.filter(idTypeOfMatch__description="Semifinal A") | playoff_silver.filter(
        idTypeOfMatch__description="Semifinal B")
    tercerPuestoSilver = playoff_silver.filter(idTypeOfMatch__description="Tercer puesto")
    finalSilver = playoff_silver.filter(idTypeOfMatch__description="Final")
    silverTrophy = {'cuartos': cuartosSilver.order_by('idTypeOfMatch'), 'semis': semisSilver,
                    'tercerPuesto': tercerPuestoSilver, 'final': finalSilver}

    calculos = calculos_grupo(idCategoria)

    context = {'clubs_categoria': clubs_categoria, 'categoria': categoria, 'zona_categoria': zona_categoria,
               'idCategoria': idCategoria.id
        , 'meta_title': 'Categoria ' + categoria,
               'playoff': {'gold': goldTrophy, 'silver': silverTrophy}, 'calculos': calculos}
    return render(request, 'categoria.html', context)


def partidos(request):
    return render(request, 'partidos.html', {'meta_title': 'Partidos'})


def partidosEquipo(request, clubName, clubId, categoryId):
    # en el context te paso:
    # club: tiene los datos del club seleccionado
    # categoria: la categoria seleccionada
    # partidos: los partidos para ese club en esa categoria
    partidos = Matches.objects.all().filter(
        (Q(idClub_Category_home=clubId) | Q(idClub_Category_away=clubId)) & Q(idCategory=categoryId))
    club = Club.objects.get(id=clubId)
    categoria = Category.objects.get(id=categoryId)
    partidosJugados = partidos.filter(homeGoals__isnull=False, awayGoals__isnull=False).order_by('-starDate')
    partidosNoJugados = partidos.filter(homeGoals__isnull=True, awayGoals__isnull=True).order_by('starDate')
    context = {'partidos': {'jugados': partidosJugados, 'noJugados': partidosNoJugados}, 'club': club,
               'categoria': categoria, 'meta_title': 'Partidos de ' + club.name}
    return render(request, 'partido-equipo.html', context)


# access to api/partidos/
def ListPartidos(request, club, categoria):
    queryset = Matches.objects.all().filter(
        (Q(idClub_Category_home=club) | Q(idClub_Category_away=club)) & Q(idCategory=categoria))
    partidos = serializers.PartidosSerializer(queryset, many=True)

    return JsonResponse({'partidos': partidos.data})


def ListarTodos(request):
    queryset = Matches.objects.all()
    partidos = serializers.PartidosSerializer(queryset, many=True)
    return JsonResponse({'partidos': partidos.data})


# accest to api/clubes
def CategoriasClub(request):
    queryset = Club.objects.all()
    clubes = serializers.CategoriasClubSerializer(queryset, many=True)
    return JsonResponse({'clubes': clubes.data})

def mostrarEquipoEscudos(request):
    if request.user.is_staff:
        return render(request, 'escudos-equipos.html')
    else:
        return HttpResponseRedirect("/")
