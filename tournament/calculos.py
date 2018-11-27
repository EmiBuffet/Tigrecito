from .models import Club, Category, Zone_Category, Matches, PlayOff
from django.db.models import Q
from operator import itemgetter


def calculos_grupo(idCategoria):
    zonas_partidos = []

    zonas_categoria = Zone_Category.objects.all().filter(idCategory=idCategoria)
    for zona in zonas_categoria:
        clubs = Club.objects.filter(zone_category__id=zona.id)

        lista_equipos = []
        for club in clubs:
            partidos = Matches.objects.all().filter(
                (Q(idClub_Category_home=club.id) | Q(idClub_Category_away=club.id)) & Q(idCategory=idCategoria))
            estadisticas = estadisticas_equipo(partidos, club)
            lista_equipos.append(
                {'club': club, 'puntos': estadisticas['puntos'],
                 'dif_goles': estadisticas['dif_goles'],
                 'partidos_jugados': estadisticas['partidos_jugados'],
                 'partidos_ganados': estadisticas['partidos_ganados'],
                 'partidos_perdidos': estadisticas['partidos_perdidos'],
                 'partidos_empatados': estadisticas['partidos_empatados'],
                 'goles_a_favor': estadisticas['goles_a_favor'],
                 'goles_en_contra': estadisticas['goles_en_contra']})
        lista_equipos = sorted(lista_equipos, key=itemgetter('puntos', 'dif_goles'), reverse=True)
        zonas_partidos.append({'zona': zona, 'lista_equipos': lista_equipos})

    return zonas_partidos


def estadisticas_equipo(partidos, club):
    puntos = 0
    partidos_jugados = 0
    partidos_ganados = 0
    partidos_perdidos = 0
    partidos_empatados = 0
    goles_a_favor = 0
    goles_en_contra = 0
    for partidos in partidos:
        if club == partidos.idClub_Category_home:
            if partidos.homeGoals is not None:
                partidos_jugados += 1
                if partidos.homeGoals > partidos.awayGoals:
                    puntos += 3
                    partidos_ganados += 1
                    goles_a_favor += partidos.homeGoals
                    goles_en_contra += partidos.awayGoals
                elif partidos.homeGoals == partidos.awayGoals:
                    puntos += 1
                    partidos_empatados += 1
                    goles_a_favor += partidos.homeGoals
                    goles_en_contra += partidos.awayGoals
                else:
                    goles_a_favor += partidos.homeGoals
                    goles_en_contra += partidos.awayGoals
                    partidos_perdidos += 1
        elif club == partidos.idClub_Category_away:
            if partidos.awayGoals is not None:
                partidos_jugados += 1
                if partidos.awayGoals > partidos.homeGoals:
                    puntos += 3
                    partidos_ganados += 1
                    goles_a_favor += partidos.awayGoals
                    goles_en_contra += partidos.homeGoals
                elif partidos.awayGoals == partidos.homeGoals:
                    puntos += 1
                    partidos_empatados += 1
                    goles_a_favor += partidos.awayGoals
                    goles_en_contra += partidos.homeGoals
                else:
                    goles_a_favor += partidos.awayGoals
                    goles_en_contra += partidos.homeGoals
                    partidos_perdidos += 1

    dif_goles = goles_a_favor - goles_en_contra

    return {'puntos': puntos, 'partidos_jugados': partidos_jugados, 'partidos_ganados': partidos_ganados,
            'partidos_perdidos': partidos_perdidos, 'partidos_empatados': partidos_empatados,
            'goles_a_favor': goles_a_favor, 'goles_en_contra': goles_en_contra, 'dif_goles': dif_goles}
