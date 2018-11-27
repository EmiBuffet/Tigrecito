from django.contrib import admin
from .models import Club, Category, Zone, Zone_Category, Matches, FootbalField, TypeOfMatch, PlayOff

# Register your models here.
admin.site.register(Club)
admin.site.register(Category)
admin.site.register(Zone)
admin.site.register(Zone_Category)
admin.site.register(Matches)
admin.site.register(FootbalField)
admin.site.register(TypeOfMatch)
admin.site.register(PlayOff)