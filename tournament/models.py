from django.db import models


# Create your models here.
class Category(models.Model):
    description = models.CharField(max_length=4)

    def __str__(self):
        return self.description


class Club(models.Model):
    name = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    category = models.ManyToManyField(Category)
    shield = models.ImageField()

    def __str__(self):
        return self.name


class Tournament(models.Model):
    idCategory = models.ForeignKey(Category, on_delete=models.CASCADE)
    starDate = models.DateTimeField()
    endDate = models.DateTimeField()

    def __str__(self):
        return self.starDate


class FootbalField(models.Model):
    fieldNumber = models.IntegerField()

    def __str__(self):
        return u"%s %s" % ("Cancha ", self.fieldNumber)


class Zone(models.Model):
    description = models.CharField(max_length=10)

    def __str__(self):
        return self.description


class Zone_Category(models.Model):
    idCategory = models.ForeignKey(Category, on_delete=models.CASCADE)
    idClub = models.ManyToManyField(Club)
    idZone = models.ForeignKey(Zone, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('idCategory', 'idZone',)

    def __str__(self):
        return u"%s %s %s" % (self.idCategory, self.idClub, self.idZone)


class Matches(models.Model):
    idCategory = models.ForeignKey(Category, on_delete=models.CASCADE)
    idClub_Category_home = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="club_category_home")
    idClub_Category_away = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="club_category_away")
    idFootbalField = models.ForeignKey(FootbalField, on_delete=models.CASCADE)
    winner = models.ForeignKey(Club, on_delete=models.CASCADE, null=True, blank=True)
    starDate = models.DateTimeField()
    homeGoals = models.IntegerField(null=True, blank=True)
    awayGoals = models.IntegerField(null=True, blank=True)
    homePenaltis = models.IntegerField(null=True, blank=True)
    awayPenaltis = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return u"%s %s %s %s" % (
            self.idClub_Category_home, "Vs", self.idClub_Category_away, self.idCategory)


class TypeOfMatch(models.Model):
    description = models.CharField(max_length=20)

    def __str__(self):
        return self.description


class PlayOff(models.Model):
    idMatch = models.ForeignKey(Matches, on_delete=models.CASCADE)
    idTypeOfMatch = models.ForeignKey(TypeOfMatch, on_delete=models.CASCADE)
    isGold = models.BooleanField()
