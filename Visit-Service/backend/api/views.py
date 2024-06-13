from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, GenericAPIView
from .serializers import *
import os
import requests
import json

# user_service_api_url = "http://localhost:8095"
user_service_api_url = "http://host.docker.internal:8095"


class ServiceListApiView(ListCreateAPIView):
    serializer_class = ServiceSerializer
    queryset = Service.objects.all()

    def get(self, request, *args, **kwargs):
        data = self.serializer_class(self.get_queryset(), many=True).data
        for service in data:
            doctor_id = Service.objects.get(id=service["id"]).doctor_id
            response = requests.get(f"{user_service_api_url}/api/v1/users/{doctor_id}", headers={"Authorization": "Bearer KEY"})
            print(response.status_code)
            doctor_data = json.loads(response.text)
            service["doctor"] = doctor_data
        return Response(data)


class DoctorServiceListApiView(ListCreateAPIView):
    serializer_class = ServiceSerializer
    queryset = Service.objects.all()

    def get(self, request, *args, **kwargs):
        service_data = self.serializer_class(self.get_queryset(), many=True).data

        return Response(service_data)

    def get_queryset(self):
        doctor_id = self.kwargs["pk"]
        return Service.objects.filter(doctor_id=doctor_id)


class OrderListView(ListCreateAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def get(self, request, *args, **kwargs):
        orders_data = self.serializer_class(self.get_queryset(), many=True).data

        for order in orders_data:
            user_id = order["customer_id"]
            response = requests.get(f"{user_service_api_url}/api/v1/users/{user_id}",
                                    headers={"Authorization": "Bearer KEY"})
            print(response.status_code)
            user_data = json.loads(response.text)
            order["customer"] = user_data

        return Response(orders_data)

    def get_queryset(self):
        url = self.request.get_full_path()
        user_id = self.kwargs["pk"]
        if "doctors" in url:
            return Order.objects.filter(service__doctor_id=user_id)
        return Order.objects.filter(customer_id=user_id).order_by("-date")


class ServiceApiView(RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    queryset = Service.objects.all()

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        doctor_id = instance.doctor_id
        response = requests.get(f"{user_service_api_url}/api/v1/users/{doctor_id}",
                                headers={"Authorization": "Bearer KEY"})
        doctor_data = json.loads(response.text)

        response_data = self.serializer_class(instance).data
        response_data["doctor"] = doctor_data

        return Response(response_data)


class AvailabilityTableApiView(RetrieveUpdateDestroyAPIView, GenericAPIView):
    serializer_class = AvailabilityTableSerializer
    queryset = AvailabilityTable.objects.all()

    def get(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance:
            data = self.serializer_class(instance).data
            return Response(data)

        return Response({}, status=404)

    def post(self, request, *args, **kwargs):
        doctor_id = kwargs.get("pk")
        created_table = self.serializer_class().create(request.data)

        table = DoctorToAvailabilityTable(availability_table=created_table, doctor_id=doctor_id)
        table.save()

        response_data = self.serializer_class(table).data
        return Response(response_data)

    def get_object(self, *args, **kwargs):
        doctor_id = self.kwargs["pk"]
        if DoctorToAvailabilityTable.objects.filter(doctor_id=doctor_id).exists():
            return DoctorToAvailabilityTable.objects.get(doctor_id=doctor_id).availability_table

        return None


class OrderView(RetrieveUpdateDestroyAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
