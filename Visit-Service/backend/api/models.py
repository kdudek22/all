from django.db import models


class CustomUpdate:
    def update(self, **kwargs):
        for name, value in kwargs.items():
            setattr(self, name, value)
        return self


class AvailabilityInterval(models.Model, CustomUpdate):
    start = models.TimeField()
    end = models.TimeField()

    def __str__(self):
        return str(self.start) + " - " + str(self.end)


class AvailabilityTable(models.Model, CustomUpdate):
    monday = models.ForeignKey(AvailabilityInterval, null=True, on_delete=models.SET_NULL, related_name="monday", blank=True)
    tuesday = models.ForeignKey(AvailabilityInterval, null=True, on_delete=models.SET_NULL, related_name="tuesday", blank=True)
    wednesday = models.ForeignKey(AvailabilityInterval, null=True, on_delete=models.SET_NULL, related_name="wednesday", blank=True)
    thursday = models.ForeignKey(AvailabilityInterval, null=True, on_delete=models.SET_NULL, related_name="thursday", blank=True)
    friday = models.ForeignKey(AvailabilityInterval, null=True, on_delete=models.SET_NULL, related_name="friday", blank=True)
    saturday = models.ForeignKey(AvailabilityInterval, null=True, on_delete=models.SET_NULL, related_name="saturday", blank=True)
    sunday = models.ForeignKey(AvailabilityInterval, null=True, on_delete=models.SET_NULL, related_name="sunday", blank=True)


class DoctorToAvailabilityTable(models.Model, CustomUpdate):
    doctor_id = models.CharField(max_length=255)
    availability_table = models.ForeignKey(AvailabilityTable, null=True, on_delete=models.SET_NULL)


class Service(models.Model, CustomUpdate):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    doctor_id = models.CharField(max_length=255)
    price = models.IntegerField(default=100)

    def __str__(self):
        return str(self.doctor_id) + str(self.name)


class Order(models.Model, CustomUpdate):
    date = models.DateTimeField()
    customer_id = models.CharField(max_length=255)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.customer_id) + str(self.service)
