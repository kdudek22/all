from .models import *
from rest_framework import serializers


class AvailabilityIntervalSerializer(serializers.Serializer):
    start = serializers.TimeField(format="%H:%M")
    end = serializers.TimeField(format="%H:%M")

    class Meta:
        model = AvailabilityInterval
        fields = ["start", "end"]


class AvailabilityTableSerializer(serializers.Serializer):
    monday = AvailabilityIntervalSerializer(allow_null=True)
    tuesday = AvailabilityIntervalSerializer(allow_null=True)
    wednesday = AvailabilityIntervalSerializer(allow_null=True)
    thursday = AvailabilityIntervalSerializer(allow_null=True)
    friday = AvailabilityIntervalSerializer(allow_null=True)
    saturday = AvailabilityIntervalSerializer(allow_null=True)
    sunday = AvailabilityIntervalSerializer(allow_null=True)

    def update(self, instance, validated_data):
        print(instance)
        for val in validated_data:
            if not validated_data[val]:
                instance.update(**{val: None})
            else:
                start, end = validated_data[val]["start"], validated_data[val]["end"]
                if AvailabilityInterval.objects.filter(start=start, end=end).exists():
                    instance.update(**{val: AvailabilityInterval.objects.get(start=start, end=end)})
                else:
                    new_interval = AvailabilityInterval(start=start, end=end)
                    new_interval.save()
                    instance.update(**{val: new_interval})
        instance.save()
        return instance

    def create(self, validated_data):
        instance = AvailabilityTable()
        for val in validated_data:
            if not validated_data[val]:
                instance.update(**{val: None})
            else:
                start, end = validated_data[val]["start"], validated_data[val]["end"]
                if AvailabilityInterval.objects.filter(start=start, end=end).exists():
                    instance.update(**{val: AvailabilityInterval.objects.get(start=start, end=end)})
                else:
                    new_interval = AvailabilityInterval(start=start, end=end)
                    new_interval.save()
                    instance.update(**{val: new_interval})
        instance.save()
        return instance

    class Meta:
        model = AvailabilityTable
        fields = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


class ServiceSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    description = serializers.CharField()
    price = serializers.CharField()
    doctor_id = serializers.CharField(write_only=True)

    class Meta:
        model = Service
        fields = ["id", "name", "description", "doctor_id", "price"]


class OrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    date = serializers.DateTimeField(format="%d/%m/%Y %H:%M")
    customer_id = serializers.CharField()
    service = ServiceSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(source="service", queryset=Service.objects.all(), write_only=True)

    class Meta:
        model = Order
        fields = ["id", "date", "customer_id", "service", "service_id"]
