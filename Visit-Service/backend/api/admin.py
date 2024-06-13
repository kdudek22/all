from django.contrib import admin
from .models import *


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Service._meta.fields]


@admin.register(AvailabilityInterval)
class AvailabilityIntervalAdmin(admin.ModelAdmin):
    list_display = [field.name for field in AvailabilityInterval._meta.fields]


@admin.register(AvailabilityTable)
class AvailabilityTableAdmin(admin.ModelAdmin):
    list_display = [field.name for field in AvailabilityTable._meta.fields]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Order._meta.fields]


@admin.register(DoctorToAvailabilityTable)
class DoctorToAvailabilityTableAdmin(admin.ModelAdmin):
    list_display = [field.name for field in DoctorToAvailabilityTable._meta.fields]
