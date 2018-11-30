from rest_framework import pagination, serializers
from .models import Matches, Club, Category


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'description',
        )
        model = Category


class CategoriasClubSerializer(serializers.ModelSerializer):
    category = CategoriaSerializer(read_only=True, many=True)

    class Meta:
        fields = (
            'id',
            'name',
            'city',
            'image_url',
            'category',
        )
        model = Club


class ClubSerializer(serializers.ModelSerializer):

    class Meta:
        fields = (
            'id',
            'name',
            'city',
            'image_url',
        )
        model = Club


class PartidosSerializer(serializers.ModelSerializer):
    idClub_Category_home = ClubSerializer(read_only=True)
    idClub_Category_away = ClubSerializer(read_only=True)
    winner = ClubSerializer(read_only=True)

    class Meta:
        fields = (
            'id',
            'idCategory',
            'idClub_Category_home',
            'idClub_Category_away',
            'idFootbalField',
            'winner',
            'starDate',
            'homeGoals',
            'awayGoals',
            'homePenaltis',
            'awayPenaltis',
        )
        model = Matches


class CustomNumberPagination(pagination.PageNumberPagination):
    page_size = 5
